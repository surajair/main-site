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
 * Find User ID by Client ID (queries apps table)
 * Returns the first user found for the given client
 * Here I want find user then By Email then Because One Client Can Have Multiple users
 */

//TODO: Need to Change This Function with Find By Mail
export async function findUserIdByClientId(clientId: string): Promise<string | null> {
  try {
    const supabase = await getSupabaseAdmin();

    const { data, error } = await supabase
      .from("apps")
      .select("user")
      .eq("client", clientId)
      .is("deletedAt", null)
      .limit(1)
      .single();

    if (error) {
      console.error("Error finding user by clientId:", error);
      return null;
    }

    if (data?.user) {
      return data.user;
    }

    return null;
  } catch (error) {
    console.error("Exception in findUserIdByClientId:", error);
    return null;
  }
}
