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
  email: z.string().trim().email().max(120),
  slotStart: z.string().datetime({ offset: true }),
  timezone: z.string().trim().min(1).max(64).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

  const { email, slotStart, timezone } = parsed.data;
  const supabase = requireSupabase();

  // Verify ownership: meeting id + email must match.
  const { data: existing, error: fetchErr } = await supabase
    .from("meetings")
    .select("id, name, email, status, slot_start")
    .eq("id", params.id)
    .single();

  if (fetchErr || !existing) {
    return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
  }
  if (existing.email.toLowerCase() !== email.toLowerCase()) {
    return NextResponse.json(
      { error: "Email does not match this booking." },
      { status: 403 }
    );
  }
  if (existing.status === "cancelled") {
    return NextResponse.json(
      { error: "This meeting was cancelled and can't be rescheduled." },
      { status: 409 }
    );
  }

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

  const update: Record<string, string> = {
    slot_start: start.toISOString(),
    slot_end: end.toISOString(),
    status: "pending",
  };
  if (timezone) update.timezone = timezone;

  const { data: updated, error: updErr } = await supabase
    .from("meetings")
    .update(update)
    .eq("id", params.id)
    .select("id, name, email, slot_start, slot_end, timezone")
    .single();

  if (updErr) {
    const code = (updErr as { code?: string }).code;
    if (code === "23P01" || /exclude|overlap/i.test(updErr.message)) {
      return NextResponse.json(
        { error: "That slot is already booked. Please pick another time." },
        { status: 409 }
      );
    }
    console.error("[reschedule] update failed", updErr);
    return NextResponse.json(
      { error: "Could not reschedule. Please try again." },
      { status: 500 }
    );
  }

  // Best-effort email notifications
  try {
    await sendEmail({
      to: ownerInbox(),
      subject: `Meeting rescheduled — ${updated.name}`,
      html: meetingNotificationHtml({
        name: updated.name,
        email: updated.email,
        purpose: null,
        slotStart: updated.slot_start,
        slotEnd: updated.slot_end,
        timezone: updated.timezone,
      }),
      replyTo: updated.email,
    });
  } catch (e) {
    console.error("[reschedule] owner email failed", e);
  }

  try {
    await sendEmail({
      to: updated.email,
      subject: "Your meeting has been rescheduled",
      html: meetingConfirmationHtml({
        name: updated.name,
        slotStart: updated.slot_start,
        slotEnd: updated.slot_end,
        timezone: updated.timezone,
      }),
    });
  } catch (e) {
    console.error("[reschedule] visitor email failed", e);
  }

  return NextResponse.json({
    ok: true,
    meeting: {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      slotStart: updated.slot_start,
      slotEnd: updated.slot_end,
      timezone: updated.timezone,
      status: "pending",
    },
  });
}
