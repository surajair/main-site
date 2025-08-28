"use client";

import { useSupabaseUser } from "@/hooks/use-supabase-user";
import ChaiBuilder from "chai-next";
import "chai-next/builder-styles";

export default function Page() {
  const { ready } = useSupabaseUser();
  return ready ? <ChaiBuilder apiUrl="editor/api" /> : null;
}
