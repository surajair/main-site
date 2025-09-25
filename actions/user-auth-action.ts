"use server";

import { createClient } from "@/chai/supabase.auth.server";
import { AuthError } from "@supabase/supabase-js";
import { checkBotId } from "botid/server";

export async function loginWithEmail(email: string, password: string): Promise<{ success: boolean; message: string; data?: any }> {
  // Check for bot
  const verification = await checkBotId();
  if (verification.isBot) {
    return { success: false, message: "Access denied" };
  }

  const supabaseServer = await createClient();

  const { data, error } = await supabaseServer.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error instanceof AuthError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "An error occurred during login" };
  }

  return { success: true, message: "Login successful", data };
}

export async function signupWithEmail(email: string, password: string): Promise<{ success: boolean; message: string; data?: any }> {
  // Check for bot
  const verification = await checkBotId();
  if (verification.isBot) {
    return { success: false, message: "Access denied" };
  }

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
      return { success: false, message: error.message };
    }
    return { success: false, message: "An error occurred during signup" };
  }

  return { success: true, message: "Account created successfully! Please check your email to verify your account.", data };
}

export async function updatePassword(newPassword: string): Promise<{ success: boolean; message: string; data?: any }> {
  // Check for bot
  const verification = await checkBotId();
  if (verification.isBot) {
    return { success: false, message: "Access denied" };
  }

  const supabaseServer = await createClient();

  const { data, error } = await supabaseServer.auth.updateUser({
    password: newPassword,
    data: {
      hasPassword: true,
    },
  });

  if (error) {
    if (error instanceof AuthError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "An error occurred while updating password" };
  }

  return { success: true, message: "Password updated successfully!", data };
}

export async function updatePasswordAction(
  _prevState: any,
  formData: FormData,
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
    const result = await updatePassword(newPassword);
    return { message: result.message, success: result.success };
  } catch (error) {
    return { message: "An unexpected error occurred while updating password", success: false };
  }
}
