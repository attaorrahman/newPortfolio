import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { z } from "zod";
import { requireSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  path: z.string().min(1).max(200),
  referrer: z.string().max(500).optional().nullable(),
  sessionId: z.string().max(64).optional().nullable(),
});

const dailySalt = () => {
  const today = new Date().toISOString().slice(0, 10);
  return `${today}:${process.env.ADMIN_SESSION_SECRET || "salt"}`;
};

const hashIp = (ip: string) =>
  createHash("sha256").update(`${ip}:${dailySalt()}`).digest("hex");

const getIp = (req: NextRequest) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  req.headers.get("x-real-ip") ||
  "unknown";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: true });

  const { path, referrer, sessionId } = parsed.data;
  const userAgent = req.headers.get("user-agent") || null;
  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    null;
  const ip = getIp(req);

  try {
    const supabase = requireSupabase();
    await supabase.from("visits").insert({
      path,
      referrer: referrer || null,
      user_agent: userAgent,
      country,
      ip_hash: hashIp(ip),
      session_id: sessionId || null,
    });
  } catch (e) {
    console.error("[track] insert failed", e);
  }

  return NextResponse.json({ ok: true });
}
