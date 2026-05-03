// TEMPORARY DEBUG ROUTE — delete after diagnosing email issues.
// Sends both the contact-style and meeting-style emails to ownerInbox()
// and returns the Resend response (or error) for each.

import { NextResponse } from "next/server";
import {
  contactNotificationHtml,
  meetingConfirmationHtml,
  meetingNotificationHtml,
  ownerInbox,
  sendEmail,
} from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const owner = ownerInbox();
  const now = new Date();
  const slotStart = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
  const slotEnd = new Date(now.getTime() + 90 * 60 * 1000).toISOString();

  const out: Record<string, unknown> = {
    owner_email: owner,
    resend_key_set: Boolean(process.env.RESEND_API_KEY),
    resend_from_set: Boolean(process.env.RESEND_FROM),
    resend_from_value: process.env.RESEND_FROM,
  };

  // 1) Contact-style email
  try {
    const r = await sendEmail({
      to: owner,
      subject: "DEBUG: contact-style email",
      html: contactNotificationHtml({
        name: "Debug Contact",
        email: "debug@example.com",
        subject: "Test",
        message: "If you see this, contact-style sends work.",
      }),
    });
    out.contact_send = { ok: true, ...r };
  } catch (e) {
    out.contact_send = {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }

  // 2) Meeting owner-notification email
  try {
    const r = await sendEmail({
      to: owner,
      subject: "DEBUG: meeting owner-notification",
      html: meetingNotificationHtml({
        name: "Debug Visitor",
        email: "debug@example.com",
        purpose: "Verifying meeting emails reach owner inbox.",
        slotStart,
        slotEnd,
        timezone: "UTC",
      }),
    });
    out.meeting_owner_send = { ok: true, ...r };
  } catch (e) {
    out.meeting_owner_send = {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }

  // 3) Meeting visitor-confirmation email (sent BACK to owner so we can verify)
  try {
    const r = await sendEmail({
      to: owner,
      subject: "DEBUG: meeting visitor-confirmation",
      html: meetingConfirmationHtml({
        name: "Debug Visitor",
        slotStart,
        slotEnd,
        timezone: "UTC",
      }),
    });
    out.meeting_visitor_send = { ok: true, ...r };
  } catch (e) {
    out.meeting_visitor_send = {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }

  return NextResponse.json(out);
}
