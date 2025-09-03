"use server";

import { getSupabaseAdmin } from "chai-next/server";

export interface FormSubmissionData {
  [key: string]: string | number | boolean | null | undefined;
}

export interface FormSubmission {
  id: number;
  createdAt: string;
  app: string;
  formData: FormSubmissionData;
  additionalData: FormSubmissionData;
}

export interface GetFormSubmissionsParams {
  websiteId: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetFormSubmissionsResponse {
  submissions: FormSubmission[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Get form submissions for a website with pagination and search
 * @param params - Parameters object
 * @param params.websiteId - The website ID
 * @param params.page - Page number (default: 1)
 * @param params.limit - Items per page (default: 10)
 * @param params.search - Search term (default: "")
 * @returns Form submissions with pagination info
 */
export async function getFormSubmissions({
  websiteId,
  page = 1,
  limit = 10,
  search = "",
}: GetFormSubmissionsParams): Promise<GetFormSubmissionsResponse> {
  try {
    const from = (page - 1) * limit;
    const to = page * limit - 1;

    const supabaseServer = await getSupabaseAdmin();

    const {
      data: submissionsData,
      count,
      error,
    } = await supabaseServer
      .from("app_form_submissions")
      .select("*", { count: "exact" })
      .eq("app", websiteId)
      .ilike("formData->>formName", `%${search}%`)
      .order("createdAt", { ascending: false })
      .range(from, to);

    if (error) {
      throw error;
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      submissions: submissionsData || [],
      total,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  } catch (error) {
    console.error("Error fetching form submissions:", error);
    throw new Error("Failed to fetch form submissions");
  }
}
