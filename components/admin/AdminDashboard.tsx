"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiOutlineUsers,
  HiOutlineMail,
  HiOutlineCalendar,
  HiOutlineEye,
  HiOutlineLogout,
  HiCheck,
  HiX,
} from "react-icons/hi";
import { FiTrendingUp } from "react-icons/fi";

type Stats = {
  totals: {
    visits: number;
    visits30: number;
    uniqueVisitors30: number;
    contacts: number;
    contacts30: number;
    meetings: number;
    pendingMeetings: number;
  };
  daily: { date: string; count: number }[];
  topPaths: { path: string; count: number }[];
};

type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
};

type Meeting = {
  id: string;
  name: string;
  email: string;
  purpose: string | null;
  slot_start: string;
  slot_end: string;
  timezone: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
};

type Tab = "overview" | "meetings" | "contacts";

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const [s, c, m] = await Promise.all([
        fetch("/api/admin/stats").then((r) => r.json()),
        fetch("/api/admin/contacts").then((r) => r.json()),
        fetch("/api/admin/meetings").then((r) => r.json()),
      ]);
      setStats(s);
      setContacts(c.contacts || []);
      setMeetings(m.meetings || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  const updateMeeting = async (
    id: string,
    status: "confirmed" | "cancelled"
  ) => {
    const prev = meetings;
    setMeetings((arr) =>
      arr.map((m) => (m.id === id ? { ...m, status } : m))
    );
    const res = await fetch(`/api/admin/meetings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      setMeetings(prev);
    }
  };

  const maxDaily = Math.max(1, ...(stats?.daily.map((d) => d.count) || [1]));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-text-muted font-semibold">
              Portfolio
            </div>
            <h1 className="text-xl font-bold text-navy font-display">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refresh}
              className="text-sm text-navy bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-full font-medium"
            >
              Refresh
            </button>
            <button
              onClick={logout}
              className="text-sm flex items-center gap-1.5 text-white bg-gradient-to-r from-primary to-accent px-4 py-2 rounded-full font-semibold shadow-md"
            >
              <HiOutlineLogout /> Sign out
            </button>
          </div>
        </div>

        <nav className="max-w-7xl mx-auto px-6 flex gap-6 border-t border-gray-100">
          {(["overview", "meetings", "contacts"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative py-3 text-sm font-semibold capitalize transition-colors ${
                tab === t ? "text-primary" : "text-text-muted hover:text-navy"
              }`}
            >
              {t}
              {tab === t && (
                <motion.span
                  layoutId="adminTab"
                  className="absolute -bottom-px left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading && !stats && (
          <div className="text-text-muted text-sm">Loading...</div>
        )}

        {tab === "overview" && stats && (
          <div className="space-y-8">
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={<HiOutlineEye />}
                label="Visits (30d)"
                value={stats.totals.visits30}
                hint={`${stats.totals.visits} all-time`}
                tone="indigo"
              />
              <StatCard
                icon={<HiOutlineUsers />}
                label="Unique visitors (30d)"
                value={stats.totals.uniqueVisitors30}
                tone="emerald"
              />
              <StatCard
                icon={<HiOutlineMail />}
                label="Messages (30d)"
                value={stats.totals.contacts30}
                hint={`${stats.totals.contacts} all-time`}
                tone="amber"
              />
              <StatCard
                icon={<HiOutlineCalendar />}
                label="Pending meetings"
                value={stats.totals.pendingMeetings}
                hint={`${stats.totals.meetings} all-time`}
                tone="primary"
              />
            </div>

            {/* Daily chart */}
            <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-navy text-lg flex items-center gap-2">
                    <FiTrendingUp className="text-primary" /> Visits — last 30 days
                  </h2>
                  <p className="text-xs text-text-muted">
                    Daily page views across the portfolio
                  </p>
                </div>
                <div className="text-3xl font-bold text-navy font-display">
                  {stats.totals.visits30}
                </div>
              </div>
              <div className="flex items-end gap-1.5 h-32">
                {stats.daily.map((d) => {
                  const h = Math.max(2, (d.count / maxDaily) * 100);
                  return (
                    <div
                      key={d.date}
                      title={`${d.date}: ${d.count}`}
                      className="flex-1 rounded-t bg-gradient-to-t from-primary/20 to-primary hover:opacity-90 transition-opacity"
                      style={{ height: `${h}%` }}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-text-muted mt-2">
                <span>{stats.daily[0]?.date}</span>
                <span>{stats.daily[stats.daily.length - 1]?.date}</span>
              </div>
            </section>

            {/* Top paths */}
            <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-navy text-lg mb-4">Top pages</h2>
              <div className="space-y-2">
                {stats.topPaths.length === 0 && (
                  <p className="text-text-muted text-sm">No data yet.</p>
                )}
                {stats.topPaths.map((p) => {
                  const max = stats.topPaths[0]?.count || 1;
                  const pct = (p.count / max) * 100;
                  return (
                    <div key={p.path}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-navy">{p.path}</span>
                        <span className="text-text-muted">{p.count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {tab === "meetings" && (
          <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <header className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-navy">
                Meetings ({meetings.length})
              </h2>
            </header>
            {meetings.length === 0 ? (
              <p className="p-6 text-text-muted text-sm">No meetings yet.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {meetings.map((m) => (
                  <div
                    key={m.id}
                    className="px-6 py-4 grid md:grid-cols-[1fr_auto] gap-3 items-start"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-navy">{m.name}</span>
                        <a
                          href={`mailto:${m.email}`}
                          className="text-xs text-primary hover:underline"
                        >
                          {m.email}
                        </a>
                        <StatusPill status={m.status} />
                      </div>
                      <div className="text-xs text-text-muted mt-1">
                        {new Date(m.slot_start).toLocaleString()} →{" "}
                        {new Date(m.slot_end).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        · {m.timezone}
                      </div>
                      {m.purpose && (
                        <p className="text-sm text-navy mt-2 whitespace-pre-wrap">
                          {m.purpose}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {m.status !== "confirmed" && (
                        <button
                          onClick={() => updateMeeting(m.id, "confirmed")}
                          className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold"
                        >
                          <HiCheck /> Confirm
                        </button>
                      )}
                      {m.status !== "cancelled" && (
                        <button
                          onClick={() => updateMeeting(m.id, "cancelled")}
                          className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 text-red-700 hover:bg-red-100 font-semibold"
                        >
                          <HiX /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {tab === "contacts" && (
          <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <header className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-navy">
                Messages ({contacts.length})
              </h2>
            </header>
            {contacts.length === 0 ? (
              <p className="p-6 text-text-muted text-sm">No messages yet.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {contacts.map((c) => (
                  <div key={c.id} className="px-6 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-navy">{c.name}</span>
                      <a
                        href={`mailto:${c.email}`}
                        className="text-xs text-primary hover:underline"
                      >
                        {c.email}
                      </a>
                      <span className="text-xs text-text-muted ml-auto">
                        {new Date(c.created_at).toLocaleString()}
                      </span>
                    </div>
                    {c.subject && (
                      <div className="text-sm font-medium text-navy mt-1">
                        {c.subject}
                      </div>
                    )}
                    <p className="text-sm text-text-muted mt-2 whitespace-pre-wrap">
                      {c.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  hint?: string;
  tone: "primary" | "indigo" | "emerald" | "amber";
}) {
  const tones: Record<typeof tone, string> = {
    primary: "from-primary/10 to-accent/10 text-primary",
    indigo: "from-indigo-100 to-indigo-50 text-indigo-600",
    emerald: "from-emerald-100 to-emerald-50 text-emerald-600",
    amber: "from-amber-100 to-amber-50 text-amber-600",
  };
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-gradient-to-br ${tones[tone]}`}
      >
        {icon}
      </div>
      <div className="text-3xl font-bold text-navy font-display mt-3">
        {value}
      </div>
      <div className="text-xs text-text-muted mt-0.5">{label}</div>
      {hint && (
        <div className="text-[10px] text-text-muted mt-1 opacity-75">
          {hint}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: Meeting["status"] }) {
  const styles: Record<Meeting["status"], string> = {
    pending: "bg-amber-50 text-amber-700",
    confirmed: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-red-50 text-red-700",
  };
  return (
    <span
      className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
}
