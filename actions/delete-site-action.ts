"use server";

import { supabaseServer } from "@/chai/supabase.server";
import { revalidatePath } from "next/cache";
import { getSession } from "./get-user-action";

const noIsNotFound = (error: any) => {
  return error && !error.message.includes("not found");
};

export async function deleteSite(siteId: string) {
  // Get current user's session
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized: User not authenticated");
  }

  // Mark as deleted by setting deletedAt
  const { error } = await supabaseServer
    .from("apps")
    .update({ deletedAt: new Date().toISOString() })
    .eq("id", siteId)
    .eq("user", session?.user?.id);

  if (noIsNotFound(error)) {
    throw error;
  }

  revalidatePath("/sites");
  return true;
}
