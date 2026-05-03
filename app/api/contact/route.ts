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

  const supabase = requireSupabase();
  const { error: dbErr } = await supabase.from("contacts").insert({
    name,
    email,
    subject: subject || null,
    message,
    user_agent: userAgent,
  });

  if (dbErr) {
    console.error("[contact] db insert failed", dbErr);
    return NextResponse.json(
      { error: "Could not save your message. Please try again." },
      { status: 500 }
    );
  }

  // Email notification to the owner — non-blocking errors
  try {
    await sendEmail({
      to: ownerInbox(),
      subject: `New contact: ${subject || "(no subject)"} — from ${name}`,
      html: contactNotificationHtml({ name, email, subject, message }),
      replyTo: email,
    });
  } catch (e) {
    console.error("[contact] owner email failed", e);
    // continue — record is saved
  }

  return NextResponse.json({ ok: true });
}
