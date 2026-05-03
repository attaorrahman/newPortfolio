"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX } from "react-icons/hi";
import { FiDownload, FiExternalLink, FiFileText } from "react-icons/fi";
import { resumeFileName, resumeUrl } from "@/lib/data";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ResumeViewer({ open, onClose }: Props) {
  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[9997] bg-navy-dark/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-label="Resume preview"
        >
          <motion.div
            initial={{ scale: 0.96, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Toolbar */}
            <div className="bg-gradient-to-r from-navy via-navy-light to-navy-dark px-4 sm:px-5 py-3 flex items-center gap-3 shrink-0">
              <FiFileText className="text-primary text-xl shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-white text-sm font-bold truncate">
                  M. Atta Ur Rahman — Resume
                </div>
                <div className="text-white/55 text-[11px] hidden sm:block">
                  PDF preview · Press Esc to close
                </div>
              </div>

              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                title="Open in new tab"
                aria-label="Open in new tab"
                className="hidden sm:inline-flex w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center text-white transition-colors"
              >
                <FiExternalLink className="text-base" />
              </a>

              <a
                href={resumeUrl}
                download={resumeFileName}
                title="Download CV"
                aria-label="Download CV"
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-primary to-accent text-white px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm shadow-md shadow-primary/30 hover:shadow-primary/50 transition-shadow"
              >
                <FiDownload className="text-base" />
                <span className="hidden sm:inline">Download</span>
              </a>

              <button
                onClick={onClose}
                aria-label="Close preview"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <HiX className="text-lg" />
              </button>
            </div>

            {/* PDF embed */}
            <div className="flex-1 bg-gray-100 relative">
              <iframe
                src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                title="Resume preview"
                className="absolute inset-0 w-full h-full"
              />
              {/* Mobile fallback (some mobile browsers don't render PDFs in iframes) */}
              <div className="sm:hidden absolute bottom-4 inset-x-4 text-center">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-navy text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-lg"
                >
                  <FiExternalLink /> Open in browser
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
