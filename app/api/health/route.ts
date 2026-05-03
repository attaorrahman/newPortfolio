import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const has = (name: string) => Boolean(process.env[name]);

export async function GET() {
  const env = {
    supabase_url: has("NEXT_PUBLIC_SUPABASE_URL"),
    supabase_anon: has("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    supabase_service: has("SUPABASE_SERVICE_ROLE_KEY"),
    resend: has("RESEND_API_KEY"),
    resend_from: has("RESEND_FROM"),
    owner_email: has("OWNER_EMAIL"),
    admin_password: has("ADMIN_PASSWORD_HASH"),
    admin_secret: has("ADMIN_SESSION_SECRET"),
    site_url: has("NEXT_PUBLIC_SITE_URL"),
  };
  const ready = Object.values(env).every(Boolean);
  return NextResponse.json(
    { ok: ready, configured: env, time: new Date().toISOString() },
    { status: ready ? 200 : 503 }
  );
}
