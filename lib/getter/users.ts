"use server";

import { createClient } from "@/chai/supabase.auth.server";
import { Session, User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

/**
 * Get the current authenticated user
 * @returns User object
 * @throws Redirects to login if user is not authenticated
 */
export async function getUser(): Promise<User> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

/**
 * Get the current user session
 * @returns Session object
 */
export async function getSession(): Promise<Session> {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session as Session;
}
