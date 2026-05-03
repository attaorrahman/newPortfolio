"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import { profile, socials, contactEmail } from "@/lib/data";

const contactIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedinIn,
  Email: HiOutlineMail,
};

const contactCards = [
  {
    icon: HiOutlineMail,
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    icon: HiOutlinePhone,
    label: "Phone",
    value: profile.phone,
    href: `tel:${profile.phone.replace(/\s/g, "")}`,
  },
  {
    icon: HiOutlineLocationMarker,
    label: "Location",
    value: profile.location,
    href: "#",
  },
];

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = new FormData(form);

    if ((data.get("_honey") as string)?.trim()) return;

    setStatus("sending");
    setErrorMsg("");

    try {
      const payload = {
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        subject: String(data.get("subject") || ""),
        message: String(data.get("message") || ""),
        _honey: String(data.get("_honey") || ""),
      };
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || `Request failed (${res.status})`);
      }
      setStatus("sent");
      form.reset();
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please email me directly."
      );
    }
  };

  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-primary font-semibold text-sm tracking-wider">
              Contact
            </span>
            <span className="text-lg">📬</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-navy font-display">
            Let's build <span className="text-primary">something together</span>
          </h2>
          <p className="text-text-muted mt-4 max-w-xl mx-auto">
            Have a project in mind or a role to fill? Drop a message below or
            reach me directly.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Info side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-4"
          >
            {contactCards.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="group flex items-center gap-4 bg-gray-50 hover:bg-primary/5 border border-gray-100 rounded-2xl p-5 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-primary text-xl shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                  <c.icon />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-text-muted uppercase tracking-wider">
                    {c.label}
                  </div>
                  <div className="text-navy font-semibold text-sm truncate">
                    {c.value}
                  </div>
                </div>
                <FiArrowUpRight className="text-text-muted group-hover:text-primary transition-colors" />
              </a>
            ))}

            <div className="pt-4">
              <div className="text-xs text-text-muted uppercase tracking-wider mb-3">
                Follow me
              </div>
              <div className="flex gap-3">
                {socials.map((s) => {
                  const Icon = contactIconMap[s.label];
                  if (!Icon) return null;
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      aria-label={s.label}
                      className="w-10 h-10 rounded-full bg-gray-50 hover:bg-primary border border-gray-200 flex items-center justify-center text-navy hover:text-white hover:border-primary transition-all"
                    >
                      <Icon className="text-sm" />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Form side */}
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-8 shadow-sm space-y-5"
          >
            {/* Honeypot — bots fill this; humans never see it */}
            <input
              type="text"
              name="_honey"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-wider">
                  Name
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-wider">
                  Email
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-wider">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                placeholder="What's this about?"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-wider">
                Message
              </label>
              <textarea
                required
                name="message"
                rows={5}
                placeholder="Tell me a little about your project..."
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <motion.button
                whileHover={{ scale: status === "idle" ? 1.02 : 1 }}
                whileTap={{ scale: status === "idle" ? 0.98 : 1 }}
                type="submit"
                disabled={status === "sending"}
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === "idle" && "Send Message"}
                {status === "sending" && "Sending..."}
                {status === "sent" && "Message Sent ✓"}
                {status === "error" && "Try Again"}
              </motion.button>

              {status === "sent" && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-emerald-600 text-sm font-medium"
                >
                  Thanks! I'll reply within 24 hours.
                </motion.span>
              )}
              {status === "error" && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-600 text-sm font-medium"
                >
                  {errorMsg ||
                    `Couldn't send. Email me at ${contactEmail} instead.`}
                </motion.span>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
