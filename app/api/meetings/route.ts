import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireSupabase } from "@/lib/supabase";
import {
  meetingConfirmationHtml,
  meetingNotificationHtml,
  ownerInbox,
  sendEmail,
} from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MEETING_DURATION_MIN = 30;

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  purpose: z.string().trim().max(2000).optional().nullable(),
  // ISO timestamp (UTC) for the slot start
  slotStart: z.string().datetime({ offset: true }),
  timezone: z.string().trim().min(1).max(64),
  _honey: z.string().optional(),
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
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  if (parsed.data._honey?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, purpose, slotStart, timezone } = parsed.data;

  const start = new Date(slotStart);
  if (Number.isNaN(start.getTime())) {
    return NextResponse.json({ error: "Invalid slot date" }, { status: 400 });
  }
  if (start.getTime() < Date.now() + 5 * 60 * 1000) {
    return NextResponse.json(
      { error: "Pick a slot at least 5 minutes in the future." },
      { status: 400 }
    );
  }
  const end = new Date(start.getTime() + MEETING_DURATION_MIN * 60 * 1000);

  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("meetings")
    .insert({
      name,
      email,
      purpose: purpose || null,
      slot_start: start.toISOString(),
      slot_end: end.toISOString(),
      timezone,
      status: "pending",
    })
    .select("id, slot_start, slot_end")
    .single();

  if (error) {
    // Postgres exclusion-constraint violation = overlap
    const code = (error as { code?: string }).code;
    if (code === "23P01" || /exclude|overlap/i.test(error.message)) {
      return NextResponse.json(
        { error: "That slot is already booked. Please pick another time." },
        { status: 409 }
      );
    }
    console.error("[meetings] insert failed", error);
    return NextResponse.json(
      { error: "Could not save your meeting. Please try again." },
      { status: 500 }
    );
  }

  const slotStartIso = data?.slot_start || start.toISOString();
  const slotEndIso = data?.slot_end || end.toISOString();
  const emailDiag: Record<string, unknown> = {};

  try {
    const r = await sendEmail({
      to: ownerInbox(),
      subject: `New meeting booked — ${name}`,
      html: meetingNotificationHtml({
        name,
        email,
        purpose,
        slotStart: slotStartIso,
        slotEnd: slotEndIso,
        timezone,
      }),
      replyTo: email,
    });
    console.log("[meetings] owner email sent:", r);
    emailDiag.owner = { ok: true, ...r };
  } catch (e) {
    console.error("[meetings] owner email failed", e);
    emailDiag.owner = {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }

  try {
    const r = await sendEmail({
      to: email,
      subject: "Your meeting with M. Atta Ur Rahman is reserved",
      html: meetingConfirmationHtml({
        name,
        slotStart: slotStartIso,
        slotEnd: slotEndIso,
        timezone,
      }),
    });
    console.log("[meetings] visitor email sent:", r);
    emailDiag.visitor = { ok: true, ...r };
  } catch (e) {
    console.error("[meetings] visitor email failed", e);
    emailDiag.visitor = {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }

  return NextResponse.json({
    ok: true,
    id: data?.id,
    ...(process.env.NODE_ENV !== "production" ? { emailDiag } : {}),
  });
}
