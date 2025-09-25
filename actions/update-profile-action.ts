"use server";

import { createClient } from "@/chai/supabase.auth.server";

export async function updateUserProfile(fullName: string): Promise<{ success: boolean; message: string; data?: any }> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Profile updated successfully", data };
}
