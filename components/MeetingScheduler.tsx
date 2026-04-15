"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { contactEmail, whatsappNumber } from "@/lib/data";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MeetingScheduler({ open, onClose }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    purpose: "",
  });
  const [sent, setSent] = useState<"email" | "whatsapp" | null>(null);

  const update = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const buildSubject = () =>
    `Meeting Request — ${form.name || "New Meeting"} on ${form.date} ${form.time}`;

  const buildMessage = () =>
    `Hi Atta,

I'd like to schedule a meeting with you.

Name: ${form.name}
Email: ${form.email}
Preferred Date: ${form.date}
Preferred Time: ${form.time}

Purpose:
${form.purpose}

Thanks!`;

  const isValid =
    form.name.trim() && form.email.trim() && form.date && form.time;

  const sendEmail = () => {
    if (!isValid) return;
    const url = `mailto:${contactEmail}?subject=${encodeURIComponent(
      buildSubject()
    )}&body=${encodeURIComponent(buildMessage())}`;
    window.location.href = url;
    setSent("email");
  };

  const sendWhatsApp = () => {
    if (!isValid) return;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      buildMessage()
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSent("whatsapp");
  };

  const today = new Date().toISOString().split("T")[0];

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
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent px-6 py-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xl font-display">
                  Schedule a Meeting
                </h3>
                <p className="text-white/80 text-xs mt-0.5">
                  Pick a date & time — I'll confirm via email or WhatsApp.
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
              >
                <HiX />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Your Name">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Full name"
                    className={inputCls}
                  />
                </Field>
                <Field label="Your Email">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Date">
                  <input
                    type="date"
                    min={today}
                    value={form.date}
                    onChange={(e) => update("date", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Time">
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => update("time", e.target.value)}
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label="Purpose (optional)">
                <textarea
                  rows={3}
                  value={form.purpose}
                  onChange={(e) => update("purpose", e.target.value)}
                  placeholder="Briefly describe what you'd like to discuss..."
                  className={`${inputCls} resize-none`}
                />
              </Field>

              {!isValid && (
                <p className="text-xs text-text-muted">
                  Fill name, email, date and time to enable send.
                </p>
              )}

              {sent && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2"
                >
                  {sent === "email"
                    ? "Opening your email client..."
                    : "Opening WhatsApp..."}
                </motion.p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <motion.button
                  whileHover={isValid ? { scale: 1.02 } : {}}
                  whileTap={isValid ? { scale: 0.98 } : {}}
                  disabled={!isValid}
                  onClick={sendEmail}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-5 py-3 rounded-full font-semibold shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiOutlineMail className="text-lg" /> Send via Email
                </motion.button>
                <motion.button
                  whileHover={isValid ? { scale: 1.02 } : {}}
                  whileTap={isValid ? { scale: 0.98 } : {}}
                  disabled={!isValid}
                  onClick={sendWhatsApp}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1FB855] text-white px-5 py-3 rounded-full font-semibold shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaWhatsapp className="text-lg" /> Send on WhatsApp
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
