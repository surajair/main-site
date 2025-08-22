"use server";

import { createClient } from "@/chai/supabase.auth.server";
import { Session, User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

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

export async function getSession(): Promise<Session> {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session as Session;
}
