import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
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
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { date } = parsed.data;

  // Day window in UTC. Frontend sends slots in UTC ISO too.
  const dayStart = new Date(`${date}T00:00:00.000Z`).toISOString();
  const dayEnd = new Date(`${date}T23:59:59.999Z`).toISOString();

  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("meetings")
    .select("slot_start, slot_end, status")
    .gte("slot_start", dayStart)
    .lte("slot_start", dayEnd)
    .neq("status", "cancelled");

  if (error) {
    console.error("[availability] db error", error);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }

  const booked = (data || []).map((row) => ({
    start: row.slot_start,
    end: row.slot_end,
  }));

  return NextResponse.json({ booked });
}
