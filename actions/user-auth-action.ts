"use server";

import { createClient } from "@/chai/supabase.auth.server";
import { AuthError } from "@supabase/supabase-js";

export async function loginWithEmail(email: string, password: string) {
  const supabaseServer = await createClient();

  const { data, error } = await supabaseServer.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error instanceof AuthError) {
      throw new Error(error.message);
    }
    throw new Error("An error occurred during login");
  }

  return data;
}

export async function signupWithEmail(email: string, password: string) {
  const supabaseServer = await createClient();

  const { data, error } = await supabaseServer.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        hasPassword: true,
      },
    },
  });

  if (error) {
    if (error instanceof AuthError) {
      throw new Error(error.message);
    }
    throw new Error("An error occurred during signup");
  }

  return data;
}

export async function resetPassword(email: string, baseUrl: string) {
  const supabaseServer = await createClient();

  const { data, error } = await supabaseServer.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/auth/callback?next=/update-password`,
  });

  if (error) {
    if (error instanceof AuthError) {
      throw new Error(error.message);
    }
    throw new Error("An error occurred while resetting password");
  }

  return data;
}

export async function updatePassword(newPassword: string) {
  const supabaseServer = await createClient();

  const { data, error } = await supabaseServer.auth.updateUser({
    password: newPassword,
    data: {
      hasPassword: true,
    },
  });

  if (error) {
    if (error instanceof AuthError) {
      throw new Error(error.message);
    }
    throw new Error("An error occurred while updating password");
  }

  return data;
}

export async function updatePasswordAction(
  _prevState: any,
  formData: FormData
): Promise<{ message: string; success: boolean }> {
  const newPassword = formData.get("new-password") as string;
  const confirmPassword = formData.get("confirm-password") as string;

  // Validate passwords match
  if (newPassword !== confirmPassword) {
    return { message: "Passwords do not match", success: false };
  }

  // Validate password length
  if (newPassword.length < 8) {
    return { message: "Password must be at least 8 characters long", success: false };
  }

  try {
    await updatePassword(newPassword);
    return { message: "Password updated successfully!", success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error && error.message ? error.message : "Failed to update password";
    return { message: errorMessage, success: false };
  }
}

export async function signOut() {
  const supabaseServer = await createClient();

  const { error } = await supabaseServer.auth.signOut();

  if (error) {
    if (error instanceof AuthError) {
      throw new Error(error.message);
    }
    throw new Error("An error occurred while signing out");
  }
}
