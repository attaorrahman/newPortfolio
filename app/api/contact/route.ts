import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireSupabase } from "@/lib/supabase";
import { contactNotificationHtml, ownerInbox, sendEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  subject: z.string().trim().max(160).optional().nullable(),
  message: z.string().trim().min(5).max(4000),
  // honeypot — must be empty
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

  // Honeypot — silently accept and discard bot submissions
  if (parsed.data._honey?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, subject, message } = parsed.data;
  const userAgent = req.headers.get("user-agent") || null;

  // Archive the message in Supabase — best effort. A DB outage (paused project,
  // bad credentials, network) must NOT block delivery: the email below is what
  // actually reaches the owner, so we log and carry on rather than 500.
  let dbSaved = false;
  try {
    const supabase = requireSupabase();
    const { error: dbErr } = await supabase.from("contacts").insert({
      name,
      email,
      subject: subject || null,
      message,
      user_agent: userAgent,
    });
    if (dbErr) throw dbErr;
    dbSaved = true;
  } catch (e) {
    console.error("[contact] db insert failed", e);
  }

  // Email notification to the owner — this is the primary delivery path.
  let emailSent = false;
  try {
    const r = await sendEmail({
      to: ownerInbox(),
      subject: `New contact: ${subject || "(no subject)"} — from ${name}`,
      html: contactNotificationHtml({ name, email, subject, message }),
      replyTo: email,
    });
    emailSent = !("skipped" in r && r.skipped);
  } catch (e) {
    console.error("[contact] owner email failed", e);
  }

  // Only fail if the message reached neither the database nor the inbox.
  if (!dbSaved && !emailSent) {
    return NextResponse.json(
      { error: "Could not deliver your message. Please email me directly." },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true });
}
