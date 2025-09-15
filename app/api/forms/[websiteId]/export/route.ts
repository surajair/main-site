import { convertFormSubmissionsToCSV } from "@/lib/utils";
import { getSupabaseAdmin } from "chai-next/server";
import { get, isEmpty } from "lodash";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ websiteId: string }> }) {
  try {
    const { websiteId } = await params;
    const { searchParams } = new URL(request.url);
    const search = get(searchParams, "search") || searchParams.get("search") || "";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const supabaseServer = await getSupabaseAdmin();

    // First, get the site name for the filename
    const { data: siteData, error: siteError } = await supabaseServer
      .from("apps")
      .select("name")
      .eq("id", websiteId)
      .single();

    if (siteError) {
      console.error("Error fetching site data:", siteError);
      return NextResponse.json({ error: "Failed to fetch site data" }, { status: 500 });
    }

    // Fetch form submissions with only the fields we need
    let query = supabaseServer
      .from("app_form_submissions")
      .select("formData, additionalData, createdAt")
      .eq("app", websiteId)
      .order("createdAt", { ascending: false });

    // Apply search filter if provided
    if (!isEmpty(search)) {
      query = query.ilike("formData->>formName", `%${search}%`);
    }

    // Apply date range filter if provided
    if (startDate) {
      query = query.gte("createdAt", startDate);
    }
    if (endDate) {
      query = query.lte("createdAt", endDate);
    }

    const { data: submissions, error } = await query;

    if (error) {
      console.error("Error fetching submissions for export:", error);
      return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
    }

    if (isEmpty(submissions)) {
      return NextResponse.json({ error: "No submissions found" }, { status: 404 });
    }

    // Convert to CSV using our improved function
    const csv = convertFormSubmissionsToCSV(submissions);

    // Create filename with site name and timestamp using Lodash get
    const siteName = get(siteData, "name", "website")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const timestamp = new Date().toISOString().split("T")[0];
    const dateRangeStr = startDate && endDate ? `_${startDate}_to_${endDate}` : "";
    const filename = `${siteName}${dateRangeStr}_${timestamp}.csv`;

    // Return CSV file
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error in export route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
