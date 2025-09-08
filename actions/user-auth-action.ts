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
