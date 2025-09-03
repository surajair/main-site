"use server";

import { createClient } from "@/chai/supabase.auth.server";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(fullName: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/account/profile");
  return data;
}
