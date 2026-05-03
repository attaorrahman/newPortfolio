import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().trim().email().max(120),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const supabase = requireSupabase();

  const { data, error } = await supabase
    .from("meetings")
    .select("id, name, email, purpose, slot_start, slot_end, timezone, status, created_at")
    .ilike("email", email)
    .order("slot_start", { ascending: true });

  if (error) {
    console.error("[lookup] db error", error);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }

  const now = Date.now();
  const all = data || [];
  const upcoming = all.filter(
    (m) => m.status !== "cancelled" && new Date(m.slot_start).getTime() > now
  );
  const past = all.filter(
    (m) =>
      m.status === "cancelled" || new Date(m.slot_start).getTime() <= now
  );

  return NextResponse.json({
    upcoming: upcoming.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      purpose: m.purpose,
      slotStart: m.slot_start,
      slotEnd: m.slot_end,
      timezone: m.timezone,
      status: m.status,
      createdAt: m.created_at,
    })),
    past: past.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      purpose: m.purpose,
      slotStart: m.slot_start,
      slotEnd: m.slot_end,
      timezone: m.timezone,
      status: m.status,
      createdAt: m.created_at,
    })),
  });
}
