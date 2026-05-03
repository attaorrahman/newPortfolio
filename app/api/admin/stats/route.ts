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

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    visits,
    visits30,
    uniqueVisitors30,
    contacts,
    contacts30,
    meetings,
    pendingMeetings,
  ] = await Promise.all([
    supabase.from("visits").select("id", { count: "exact", head: true }),
    supabase
      .from("visits")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since),
    supabase
      .from("visits")
      .select("ip_hash")
      .gte("created_at", since)
      .not("ip_hash", "is", null),
    supabase.from("contacts").select("id", { count: "exact", head: true }),
    supabase
      .from("contacts")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since),
    supabase.from("meetings").select("id", { count: "exact", head: true }),
    supabase
      .from("meetings")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  // Daily visit series for last 30 days
  const { data: recentVisits } = await supabase
    .from("visits")
    .select("created_at, path")
    .gte("created_at", since)
    .order("created_at", { ascending: true });

  const dailyMap = new Map<string, number>();
  const pathMap = new Map<string, number>();
  for (const v of recentVisits || []) {
    const day = (v.created_at as string).slice(0, 10);
    dailyMap.set(day, (dailyMap.get(day) || 0) + 1);
    pathMap.set(v.path, (pathMap.get(v.path) || 0) + 1);
  }

  const days: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    days.push({ date: d, count: dailyMap.get(d) || 0 });
  }

  const topPaths = Array.from(pathMap.entries())
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const uniqueIps = new Set(
    (uniqueVisitors30.data || []).map((r) => r.ip_hash as string)
  );

  return NextResponse.json({
    totals: {
      visits: visits.count ?? 0,
      visits30: visits30.count ?? 0,
      uniqueVisitors30: uniqueIps.size,
      contacts: contacts.count ?? 0,
      contacts30: contacts30.count ?? 0,
      meetings: meetings.count ?? 0,
      pendingMeetings: pendingMeetings.count ?? 0,
    },
    daily: days,
    topPaths,
  });
}
