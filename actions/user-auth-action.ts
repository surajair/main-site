"use server";

import { createClient } from "@/chai/supabase.auth.server";
import { AuthError } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export async function loginWithEmail(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
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
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
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
  const supabase = await createClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
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
  const supabase = await createClient();

  const { data, error } = await supabase.auth.updateUser({
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

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    if (error instanceof AuthError) {
      throw new Error(error.message);
    }
    throw new Error("An error occurred during logout");
  }

  redirect("/login");
}

export async function handlePasswordRecovery(newPassword: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    if (error instanceof AuthError) {
      throw new Error(error.message);
    }
    throw new Error("An error occurred while updating password");
  }

  return data;
}

export async function checkAuthState() {
  const supabase = await createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    if (error instanceof AuthError) {
      throw new Error(error.message);
    }
    throw new Error("An error occurred while checking auth state");
  }

  return {
    isAuthenticated: !!session,
    isPasswordRecovery:
      session?.user?.aud === "authenticated" &&
      session?.user?.app_metadata?.provider === "email" &&
      session?.user?.app_metadata?.recovery === true,
    user: session?.user || null,
  };
}
