import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { requireSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .order("slot_start", { ascending: false })
    .limit(200);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ meetings: data || [] });
}
