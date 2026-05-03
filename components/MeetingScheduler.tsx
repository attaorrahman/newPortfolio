"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiX,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineMail,
} from "react-icons/hi";
import { FiCheckCircle, FiEdit3, FiTrash2, FiArrowLeft } from "react-icons/fi";

type Props = {
  open: boolean;
  onClose: () => void;
};

const SLOT_DURATION_MIN = 30;
const WORK_START_HOUR = 9;
const WORK_END_HOUR = 18;

type Booked = { start: string; end: string };

type ManagedMeeting = {
  id: string;
  name: string;
  email: string;
  purpose: string | null;
  slotStart: string;
  slotEnd: string;
  timezone: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
};

type Mode =
  | { kind: "select" }
  | { kind: "book"; step: "pick" | "form" | "done" }
  | {
      kind: "manage";
      step: "lookup" | "list" | "reschedule" | "done";
      email?: string;
      meetings?: { upcoming: ManagedMeeting[]; past: ManagedMeeting[] };
      reschedulingId?: string;
    };

function buildDaySlots(dateStr: string): { start: Date; label: string }[] {
  const slots: { start: Date; label: string }[] = [];
  for (let h = WORK_START_HOUR; h < WORK_END_HOUR; h++) {
    for (const m of [0, 30]) {
      const start = new Date(`${dateStr}T00:00:00`);
      start.setHours(h, m, 0, 0);
      slots.push({
        start,
        label: start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }
  }
  return slots;
}

const localDateStr = (d: Date) => {
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60 * 1000).toISOString().slice(0, 10);
};

const todayStr = () => localDateStr(new Date());
const addDaysStr = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return localDateStr(d);
};

export default function MeetingScheduler({ open, onClose }: Props) {
  const [mode, setMode] = useState<Mode>({ kind: "select" });

  // Booking state
  const [date, setDate] = useState<string>(todayStr());
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [booked, setBooked] = useState<Booked[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", purpose: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manage state
  const [lookupEmail, setLookupEmail] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);

  const tz = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    []
  );

  useEffect(() => {
    if (!open) {
      setMode({ kind: "select" });
      setSelectedSlot(null);
      setForm({ name: "", email: "", purpose: "" });
      setLookupEmail("");
      setError(null);
      setDate(todayStr());
    }
  }, [open]);

  // Load availability whenever the picker is showing
  const showingSlotPicker =
    (mode.kind === "book" && mode.step === "pick") ||
    (mode.kind === "manage" && mode.step === "reschedule");

  useEffect(() => {
    if (!open || !showingSlotPicker) return;
    let cancelled = false;
    setLoadingSlots(true);
    fetch("/api/meetings/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    })
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        setBooked(j.booked || []);
      })
      .catch(() => {
        if (!cancelled) setBooked([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });
    return () => {
      cancelled = true;
    };
  }, [date, open, showingSlotPicker]);

  const slots = useMemo(() => buildDaySlots(date), [date]);

  const isBooked = (slotStart: Date, ignoreId?: string) => {
    const startMs = slotStart.getTime();
    const endMs = startMs + SLOT_DURATION_MIN * 60 * 1000;
    return booked.some((b) => {
      const bStart = new Date(b.start).getTime();
      const bEnd = new Date(b.end).getTime();
      // overlap
      const overlaps = startMs < bEnd && endMs > bStart;
      if (!overlaps) return false;
      // While rescheduling, the meeting's own slot shouldn't block itself
      if (
        ignoreId &&
        mode.kind === "manage" &&
        mode.meetings?.upcoming.find((m) => m.id === ignoreId)?.slotStart ===
          b.start
      ) {
        return false;
      }
      return true;
    });
  };

  const isPast = (slotStart: Date) =>
    slotStart.getTime() < Date.now() + 5 * 60 * 1000;

  const dayPills = useMemo(() => {
    const out: { value: string; label: string; sub: string }[] = [];
    for (let i = 0; i < 14; i++) {
      const v = addDaysStr(i);
      const d = new Date(`${v}T00:00:00`);
      out.push({
        value: v,
        label: d.toLocaleDateString([], { weekday: "short" }),
        sub: d.toLocaleDateString([], { day: "numeric", month: "short" }),
      });
    }
    return out;
  }, []);

  const formValid =
    form.name.trim().length >= 2 && /\S+@\S+\.\S+/.test(form.email);

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          purpose: form.purpose,
          slotStart: selectedSlot.toISOString(),
          timezone: tz,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || `Request failed (${res.status})`);
      setMode({ kind: "book", step: "done" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not book meeting.");
    } finally {
      setSubmitting(false);
    }
  };

  const lookupMeetings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(lookupEmail) || lookupLoading) return;
    setError(null);
    setLookupLoading(true);
    try {
      const res = await fetch("/api/meetings/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: lookupEmail }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Lookup failed");
      setMode({
        kind: "manage",
        step: "list",
        email: lookupEmail,
        meetings: { upcoming: json.upcoming || [], past: json.past || [] },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed.");
    } finally {
      setLookupLoading(false);
    }
  };

  const refreshLookup = async (email: string) => {
    const res = await fetch("/api/meetings/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const json = await res.json().catch(() => ({}));
    if (mode.kind === "manage") {
      setMode({
        kind: "manage",
        step: "list",
        email,
        meetings: { upcoming: json.upcoming || [], past: json.past || [] },
      });
    }
  };

  const cancelMeeting = async (id: string) => {
    if (mode.kind !== "manage" || !mode.email) return;
    if (!confirm("Cancel this meeting? You can rebook later if needed.")) return;
    setError(null);
    const res = await fetch(`/api/meetings/${id}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: mode.email }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json?.error || "Cancel failed");
      return;
    }
    refreshLookup(mode.email);
  };

  const startReschedule = (id: string) => {
    if (mode.kind !== "manage" || !mode.meetings) return;
    const m = mode.meetings.upcoming.find((x) => x.id === id);
    if (!m) return;
    setSelectedSlot(null);
    setDate(localDateStr(new Date(m.slotStart)));
    setMode({ ...mode, step: "reschedule", reschedulingId: id });
  };

  const submitReschedule = async () => {
    if (mode.kind !== "manage" || !mode.email || !mode.reschedulingId || !selectedSlot)
      return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/meetings/${mode.reschedulingId}/reschedule`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: mode.email,
            slotStart: selectedSlot.toISOString(),
            timezone: tz,
          }),
        }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Reschedule failed");
      await refreshLookup(mode.email);
      setSelectedSlot(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reschedule failed.");
    } finally {
      setSubmitting(false);
    }
  };

  // ───────────────────────── UI ─────────────────────────

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[9998] bg-navy-dark/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="bg-gradient-to-r from-primary to-accent px-6 py-5 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-xl font-display flex items-center gap-2">
                  <HiOutlineCalendar /> {modeTitle(mode)}
                </h3>
                <p className="text-white/80 text-xs mt-0.5">
                  {modeSubtitle(mode)}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center"
              >
                <HiX />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {/* MODE PICKER */}
              {mode.kind === "select" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setMode({ kind: "book", step: "pick" })}
                    className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 hover:from-primary/15 hover:to-accent/15 border-2 border-primary/20 hover:border-primary text-left transition-all"
                  >
                    <HiOutlineCalendar className="text-3xl text-primary mb-3" />
                    <div className="font-bold text-navy">Book a new meeting</div>
                    <p className="text-text-muted text-sm mt-1">
                      Pick an available 30-min slot.
                    </p>
                  </button>
                  <button
                    onClick={() => setMode({ kind: "manage", step: "lookup" })}
                    className="p-6 rounded-2xl bg-gray-50 hover:bg-white border-2 border-gray-200 hover:border-primary text-left transition-all"
                  >
                    <FiEdit3 className="text-3xl text-navy mb-3" />
                    <div className="font-bold text-navy">
                      Manage existing booking
                    </div>
                    <p className="text-text-muted text-sm mt-1">
                      Reschedule or cancel a meeting you booked before.
                    </p>
                  </button>
                </div>
              )}

              {/* BOOK FLOW */}
              {mode.kind === "book" && mode.step === "pick" && (
                <SlotPicker
                  date={date}
                  setDate={setDate}
                  setSelectedSlot={setSelectedSlot}
                  selectedSlot={selectedSlot}
                  loadingSlots={loadingSlots}
                  slots={slots}
                  isBooked={(d) => isBooked(d)}
                  isPast={isPast}
                  dayPills={dayPills}
                  tz={tz}
                />
              )}

              {mode.kind === "book" && mode.step === "pick" && (
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={() => setMode({ kind: "select" })}
                    className="text-sm text-text-muted hover:text-navy flex items-center gap-1"
                  >
                    <FiArrowLeft /> Back
                  </button>
                  <motion.button
                    whileHover={selectedSlot ? { scale: 1.02 } : {}}
                    whileTap={selectedSlot ? { scale: 0.98 } : {}}
                    disabled={!selectedSlot}
                    onClick={() => setMode({ kind: "book", step: "form" })}
                    className="bg-gradient-to-r from-primary to-accent text-white px-7 py-3 rounded-full font-semibold shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </motion.button>
                </div>
              )}

              {mode.kind === "book" && mode.step === "form" && selectedSlot && (
                <form onSubmit={submitBooking} className="space-y-4">
                  <SlotSummary
                    slot={selectedSlot}
                    onChange={() => setMode({ kind: "book", step: "pick" })}
                  />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Your Name">
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        placeholder="Full name"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Your Email">
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                        placeholder="you@example.com"
                        className={inputCls}
                      />
                    </Field>
                  </div>
                  <Field label="What would you like to discuss? (optional)">
                    <textarea
                      rows={3}
                      value={form.purpose}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, purpose: e.target.value }))
                      }
                      placeholder="A short brief helps me prepare..."
                      className={`${inputCls} resize-none`}
                    />
                  </Field>
                  {error && <ErrorBox text={error} />}
                  <div className="flex gap-3 justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setMode({ kind: "book", step: "pick" })}
                      className="px-5 py-3 rounded-full font-semibold text-sm text-navy border border-gray-200 hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <motion.button
                      whileHover={formValid && !submitting ? { scale: 1.02 } : {}}
                      whileTap={formValid && !submitting ? { scale: 0.98 } : {}}
                      disabled={!formValid || submitting}
                      type="submit"
                      className="bg-gradient-to-r from-primary to-accent text-white px-7 py-3 rounded-full font-semibold text-sm shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Booking..." : "Confirm Booking"}
                    </motion.button>
                  </div>
                </form>
              )}

              {mode.kind === "book" && mode.step === "done" && selectedSlot && (
                <SuccessScreen
                  title="You're booked!"
                  email={form.email}
                  slot={selectedSlot}
                  onClose={onClose}
                />
              )}

              {/* MANAGE FLOW */}
              {mode.kind === "manage" && mode.step === "lookup" && (
                <form onSubmit={lookupMeetings} className="space-y-4">
                  <p className="text-text-muted text-sm">
                    Enter the email you booked with and we'll show your meetings.
                  </p>
                  <Field label="Your Email">
                    <div className="relative">
                      <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        required
                        type="email"
                        value={lookupEmail}
                        onChange={(e) => setLookupEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={`${inputCls} pl-10`}
                      />
                    </div>
                  </Field>
                  {error && <ErrorBox text={error} />}
                  <div className="flex justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setMode({ kind: "select" })}
                      className="text-sm text-text-muted hover:text-navy flex items-center gap-1"
                    >
                      <FiArrowLeft /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={lookupLoading}
                      className="bg-gradient-to-r from-primary to-accent text-white px-7 py-3 rounded-full font-semibold text-sm shadow-lg shadow-primary/30 disabled:opacity-50"
                    >
                      {lookupLoading ? "Looking up..." : "Find my meetings"}
                    </button>
                  </div>
                </form>
              )}

              {mode.kind === "manage" && mode.step === "list" && mode.meetings && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-text-muted">
                      Showing meetings for{" "}
                      <span className="font-semibold text-navy">{mode.email}</span>
                    </p>
                    <button
                      onClick={() => setMode({ kind: "manage", step: "lookup" })}
                      className="text-xs text-primary font-semibold hover:underline"
                    >
                      Change email
                    </button>
                  </div>

                  <section>
                    <h4 className="text-xs uppercase tracking-wider text-navy font-bold mb-3">
                      Upcoming ({mode.meetings.upcoming.length})
                    </h4>
                    {mode.meetings.upcoming.length === 0 ? (
                      <p className="text-sm text-text-muted bg-gray-50 rounded-xl p-4">
                        No upcoming meetings. Book a new one from the previous screen.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {mode.meetings.upcoming.map((m) => (
                          <div
                            key={m.id}
                            className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/15 rounded-xl p-4 flex items-start justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <div className="font-semibold text-navy text-sm">
                                {new Date(m.slotStart).toLocaleString([], {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                              <div className="text-[11px] text-text-muted mt-1 flex items-center gap-2">
                                <StatusBadge status={m.status} />
                                <span>· {m.timezone}</span>
                              </div>
                              {m.purpose && (
                                <p className="text-xs text-text-muted mt-2 whitespace-pre-wrap">
                                  {m.purpose}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col gap-1.5 shrink-0">
                              <button
                                onClick={() => startReschedule(m.id)}
                                className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-primary hover:text-white text-navy border border-primary/30 font-semibold transition-colors"
                              >
                                <FiEdit3 /> Reschedule
                              </button>
                              <button
                                onClick={() => cancelMeeting(m.id)}
                                className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-red-500 hover:text-white text-red-600 border border-red-200 font-semibold transition-colors"
                              >
                                <FiTrash2 /> Cancel
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <section>
                    <h4 className="text-xs uppercase tracking-wider text-navy font-bold mb-3">
                      Past & cancelled ({mode.meetings.past.length})
                    </h4>
                    {mode.meetings.past.length === 0 ? (
                      <p className="text-sm text-text-muted bg-gray-50 rounded-xl p-4">
                        No past bookings.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {mode.meetings.past.map((m) => (
                          <div
                            key={m.id}
                            className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center justify-between gap-3 opacity-80"
                          >
                            <div className="min-w-0">
                              <div className="text-sm text-navy font-medium">
                                {new Date(m.slotStart).toLocaleString([], {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </div>
                            <StatusBadge status={m.status} />
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {error && <ErrorBox text={error} />}
                </div>
              )}

              {mode.kind === "manage" &&
                mode.step === "reschedule" &&
                mode.reschedulingId && (
                  <div>
                    <SlotPicker
                      date={date}
                      setDate={setDate}
                      setSelectedSlot={setSelectedSlot}
                      selectedSlot={selectedSlot}
                      loadingSlots={loadingSlots}
                      slots={slots}
                      isBooked={(d) => isBooked(d, mode.reschedulingId)}
                      isPast={isPast}
                      dayPills={dayPills}
                      tz={tz}
                    />
                    {error && (
                      <div className="mt-4">
                        <ErrorBox text={error} />
                      </div>
                    )}
                    <div className="mt-6 flex items-center justify-between">
                      <button
                        onClick={() =>
                          setMode({
                            kind: "manage",
                            step: "list",
                            email: mode.email,
                            meetings: mode.meetings,
                          })
                        }
                        className="text-sm text-text-muted hover:text-navy flex items-center gap-1"
                      >
                        <FiArrowLeft /> Back
                      </button>
                      <motion.button
                        whileHover={
                          selectedSlot && !submitting ? { scale: 1.02 } : {}
                        }
                        whileTap={
                          selectedSlot && !submitting ? { scale: 0.98 } : {}
                        }
                        disabled={!selectedSlot || submitting}
                        onClick={submitReschedule}
                        className="bg-gradient-to-r from-primary to-accent text-white px-7 py-3 rounded-full font-semibold text-sm shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? "Saving..." : "Save new time"}
                      </motion.button>
                    </div>
                  </div>
                )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ───────────────────────── Subcomponents ─────────────────────────

function modeTitle(mode: Mode) {
  if (mode.kind === "select") return "Schedule a Meeting";
  if (mode.kind === "book") {
    if (mode.step === "pick") return "Pick a slot";
    if (mode.step === "form") return "Confirm details";
    return "Booked!";
  }
  if (mode.step === "lookup") return "Find your meetings";
  if (mode.step === "list") return "Your meetings";
  if (mode.step === "reschedule") return "Pick a new slot";
  return "Done";
}

function modeSubtitle(mode: Mode) {
  if (mode.kind === "select")
    return "Book a new meeting or manage an existing booking.";
  if (mode.kind === "book") {
    if (mode.step === "pick") return "Available 30-minute slots.";
    if (mode.step === "form") return "Enter your contact details.";
    return "Your meeting is reserved.";
  }
  if (mode.step === "lookup") return "Enter the email you booked with.";
  if (mode.step === "list") return "Reschedule or cancel upcoming meetings.";
  if (mode.step === "reschedule") return "Choose a new date and time.";
  return "Updated.";
}

function SlotPicker({
  date,
  setDate,
  setSelectedSlot,
  selectedSlot,
  loadingSlots,
  slots,
  isBooked,
  isPast,
  dayPills,
  tz,
}: {
  date: string;
  setDate: (d: string) => void;
  setSelectedSlot: (d: Date | null) => void;
  selectedSlot: Date | null;
  loadingSlots: boolean;
  slots: { start: Date; label: string }[];
  isBooked: (d: Date) => boolean;
  isPast: (d: Date) => boolean;
  dayPills: { value: string; label: string; sub: string }[];
  tz: string;
}) {
  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1">
        {dayPills.map((d) => (
          <button
            key={d.value}
            onClick={() => {
              setDate(d.value);
              setSelectedSlot(null);
            }}
            className={`shrink-0 flex flex-col items-center min-w-[64px] py-2 px-3 rounded-xl border text-sm transition-all ${
              date === d.value
                ? "bg-gradient-to-br from-primary to-accent text-white border-transparent shadow-lg shadow-primary/25"
                : "bg-gray-50 hover:bg-white text-navy border-gray-200"
            }`}
          >
            <span
              className={`text-[10px] font-semibold uppercase ${
                date === d.value ? "text-white/85" : "text-text-muted"
              }`}
            >
              {d.label}
            </span>
            <span className="text-base font-bold mt-0.5">
              {d.sub.split(" ")[0]}
            </span>
            <span
              className={`text-[10px] ${
                date === d.value ? "text-white/80" : "text-text-muted"
              }`}
            >
              {d.sub.split(" ")[1]}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold text-navy uppercase tracking-wider flex items-center gap-1.5">
            <HiOutlineClock /> Available slots
          </div>
          <span className="text-[11px] text-text-muted">
            Times in your tz · {tz}
          </span>
        </div>

        {loadingSlots ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-10 rounded-xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {slots.map((s) => {
              const taken = isBooked(s.start);
              const past = isPast(s.start);
              const disabled = taken || past;
              const selected =
                selectedSlot?.getTime() === s.start.getTime();
              return (
                <button
                  key={s.start.toISOString()}
                  disabled={disabled}
                  onClick={() => setSelectedSlot(s.start)}
                  className={`relative h-10 text-sm rounded-xl font-medium transition-all border ${
                    selected
                      ? "bg-gradient-to-br from-primary to-accent text-white border-transparent shadow-md"
                      : disabled
                        ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through"
                        : "bg-white hover:bg-primary/5 hover:border-primary text-navy border-gray-200"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

function SlotSummary({
  slot,
  onChange,
}: {
  slot: Date;
  onChange: () => void;
}) {
  return (
    <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl px-4 py-3 flex items-center justify-between">
      <div>
        <div className="text-xs text-text-muted uppercase tracking-wider">
          Your slot
        </div>
        <div className="text-navy font-semibold text-sm">
          {slot.toLocaleString([], {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
      <button
        type="button"
        onClick={onChange}
        className="text-xs text-primary font-semibold hover:underline"
      >
        Change
      </button>
    </div>
  );
}

function SuccessScreen({
  title,
  email,
  slot,
  onClose,
}: {
  title: string;
  email: string;
  slot: Date;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-6"
    >
      <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-3xl">
        <FiCheckCircle />
      </div>
      <h4 className="mt-4 text-2xl font-bold text-navy font-display">{title}</h4>
      <p className="text-text-muted mt-2 text-sm max-w-md mx-auto">
        A confirmation email has been sent to{" "}
        <strong className="text-navy">{email}</strong>. Atta will follow up
        shortly.
      </p>
      <div className="mt-5 inline-block bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-navy">
        {slot.toLocaleString([], {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
      <div className="mt-6">
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-primary to-accent text-white px-7 py-3 rounded-full font-semibold text-sm shadow-lg shadow-primary/30"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: ManagedMeeting["status"] }) {
  const styles: Record<ManagedMeeting["status"], string> = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function ErrorBox({ text }: { text: string }) {
  return (
    <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
      {text}
    </p>
  );
}

const inputCls =
  "w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm text-navy";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-navy mb-1.5 uppercase tracking-wider">
        {label}
      </span>
      {children}
    </label>
  );
}
