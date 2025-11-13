"use server";

import { getSupabaseAdmin } from "chai-next/server";
import { revalidateTag } from "next/cache";

/**
 * Handle subscription cancellation or expiration
 */
export const cancelUserPlan = async (subscriptionId: string) => {
  try {
    if (!subscriptionId) {
      return { success: false, error: "Missing subscription ID" };
    }

    const supabaseServer = await getSupabaseAdmin();

    // Find the user associated with this subscription
    const { data: userPlan, error: planError } = await supabaseServer
      .from("app_user_plans")
      .select("user, client")
      .eq("subscriptionId", subscriptionId)
      .single();

    if (planError || !userPlan) {
      console.error("Error finding user plan:", planError);
      return { success: false, error: "User plan not found for this subscription" };
    }

    const userId = userPlan.user;
    const client = userPlan.client;

    // Get all websites (apps) for this user to revalidate their settings
    const { data: userApps, error: appsError } = await supabaseServer
      .from("apps")
      .select("id")
      .eq("user", userId)
      .eq("client", client);

    if (appsError) {
      console.error("Error fetching user apps:", appsError);
    }
    const apps = userApps?.map((app: any) => app.id) || [];

    // Set domain column to null in app_domains table for all user's apps
    const { error: domainUpdateError } = await supabaseServer
      .from("app_domains")
      .update({ domain: null })
      .in("app", apps);

    if (domainUpdateError) {
      console.error("Error updating app_domains:", domainUpdateError);
      return { success: false, error: "Failed to update domain settings" };
    }

    // Revalidate the pages for each website
    if (apps && apps.length > 0) {
      apps.forEach((app: string) => {
        revalidateTag(`website-settings-${app}`);
      });
    }

    // Remove the record from user_plans table
    const { error: deleteError } = await supabaseServer
      .from("app_user_plans")
      .delete()
      .eq("subscriptionId", subscriptionId)
      .eq("user", userId)
      .eq("client", client);

    if (deleteError) {
      console.error("Error deleting user plan:", deleteError);
      return { success: false, error: "Failed to remove user plan" };
    }

    return {
      success: true,
      message: "Subscription cancelled successfully",
      userId,
      appsRevalidated: apps,
    };
  } catch (error: any) {
    console.error("Error cancelling subscription:", error);
    return { success: false, error: error.message || "Failed to cancel subscription" };
  }
};
