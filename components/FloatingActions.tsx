"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { HiOutlineCalendar } from "react-icons/hi";
import MeetingScheduler from "./MeetingScheduler";
import { contactEmail, whatsappNumber } from "@/lib/data";

export default function FloatingActions() {
  const [schedulerOpen, setSchedulerOpen] = useState(false);

  const actions = [
    {
      label: "WhatsApp",
      icon: FaWhatsapp,
      bg: "bg-[#25D366] hover:bg-[#1FB855]",
      ring: "shadow-green-500/40",
      onClick: () =>
        window.open(
          `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            "Hi Atta, I'd like to get in touch with you."
          )}`,
          "_blank",
          "noopener,noreferrer"
        ),
    },
    {
      label: "Email",
      icon: SiGmail,
      bg: "bg-[#EA4335] hover:bg-[#c53429]",
      ring: "shadow-red-500/40",
      onClick: () => {
        window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(
          "Hello from your portfolio"
        )}`;
      },
    },
    {
      label: "Schedule Meeting",
      icon: HiOutlineCalendar,
      bg: "bg-gradient-to-br from-primary to-accent hover:from-accent hover:to-primary",
      ring: "shadow-primary/40",
      onClick: () => setSchedulerOpen(true),
    },
  ];

  return (
    <>
      <div className="fixed right-5 bottom-5 z-[9990] flex flex-col gap-3">
        {actions.map((a, i) => (
          <motion.button
            key={a.label}
            type="button"
            aria-label={a.label}
            onClick={a.onClick}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + i * 0.12, type: "spring", damping: 18 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className={`group relative w-13 h-13 md:w-14 md:h-14 rounded-full ${a.bg} ${a.ring} shadow-xl flex items-center justify-center text-white text-xl transition-colors`}
            style={{ width: 54, height: 54 }}
          >
            <a.icon />
            {/* Pulsing halo */}
            <span className="absolute inset-0 rounded-full bg-current opacity-20 animate-ping pointer-events-none" />

            {/* Tooltip */}
            <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-navy text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
              {a.label}
              <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-navy" />
            </span>
          </motion.button>
        ))}
      </div>

      <MeetingScheduler
        open={schedulerOpen}
        onClose={() => setSchedulerOpen(false)}
      />
    </>
  );
}
