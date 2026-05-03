import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireSupabase } from "@/lib/supabase";
import { ownerInbox, sendEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().trim().email().max(120),
});

export async function POST(
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
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const supabase = requireSupabase();
  const { data: existing, error: fetchErr } = await supabase
    .from("meetings")
    .select("id, name, email, status, slot_start")
    .eq("id", params.id)
    .single();

  if (fetchErr || !existing) {
    return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
  }
  if (existing.email.toLowerCase() !== parsed.data.email.toLowerCase()) {
    return NextResponse.json(
      { error: "Email does not match this booking." },
      { status: 403 }
    );
  }

  const { error: updErr } = await supabase
    .from("meetings")
    .update({ status: "cancelled" })
    .eq("id", params.id);

  if (updErr) {
    return NextResponse.json({ error: "Cancel failed" }, { status: 500 });
  }

  try {
    await sendEmail({
      to: ownerInbox(),
      subject: `Meeting cancelled by ${existing.name}`,
      html: `<p><strong>${existing.name}</strong> (${existing.email}) cancelled the meeting at ${new Date(
        existing.slot_start
      ).toUTCString()}.</p>`,
    });
  } catch (e) {
    console.error("[cancel] owner email failed", e);
  }

  return NextResponse.json({ ok: true });
}
