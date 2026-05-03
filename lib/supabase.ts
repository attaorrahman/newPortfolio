import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

function buildClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Server-only Supabase client. Bypasses RLS — never import from a client component. */
export function requireSupabase(): SupabaseClient {
  if (!cached) cached = buildClient();
  if (!cached) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return cached;
}

export type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  user_agent: string | null;
  created_at: string;
};

export type Meeting = {
  id: string;
  name: string;
  email: string;
  purpose: string | null;
  slot_start: string;
  slot_end: string;
  timezone: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
};

export type Visit = {
  id: string;
  path: string;
  referrer: string | null;
  user_agent: string | null;
  country: string | null;
  ip_hash: string | null;
  session_id: string | null;
  created_at: string;
};
