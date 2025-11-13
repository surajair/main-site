"use server";

import { getSupabaseAdmin } from "chai-next/server";

/**
 * Log webhook event to database for audit trail and debugging
 */
export async function logWebhookEvent(data: {
  provider: string;
  eventType: string;
  payload: any;
  userId?: string;
  clientId?: string;
}) {
  try {
    const supabase = await getSupabaseAdmin();

    const { data: webhook, error } = await supabase
      .from("webhook_events")
      .insert({
        provider: data.provider,
        eventType: data.eventType,
        payload: data.payload,
        userId: data.userId,
        clientId: data.clientId,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to log webhook event:", error);
      return { webhook: null, error };
    }

    return { webhook, error: null };
  } catch (error) {
    console.error("Exception logging webhook:", error);
    return { webhook: null, error };
  }
}

/**
 * Find User ID by email
 */

export async function findUserIdByEmail(email: string): Promise<string | null> {
  try {
    if (!email) {
      console.warn("No contact email found");
      return null;
    }
    const supabase = await getSupabaseAdmin();
    const { data: rpcResult, error: rpcError } = await supabase.rpc("get_user_id_by_email", { email });

    if (rpcError) {
      console.error("Error fetching user by email via RPC:", rpcError);
      return null;
    }
    console.log("User ID found:", rpcResult);
    return rpcResult?.[0]?.id || null;
  } catch (error) {
    console.error("Exception in findUserIdByEmail:", error);
    return null;
  }
}
