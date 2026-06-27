"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function RouteLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement | null)?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href) return;
      if (
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:") ||
        href.startsWith("http://") ||
        href.startsWith("https://")
      ) return;
      if (href.startsWith("#")) return;

      const url = new URL(anchor.href, window.location.href);
      const samePath =
        url.pathname === window.location.pathname &&
        url.search === window.location.search;
      if (samePath) return;

      startLoading();
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (loading) finishLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams?.toString()]);

  const startLoading = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (finishRef.current) clearTimeout(finishRef.current);
    setProgress(10);
    setLoading(true);

    tickRef.current = setInterval(() => {
      setProgress((p) => {
        if (p < 65) return p + Math.random() * 10;
        if (p < 88) return p + Math.random() * 2;
        return p;
      });
    }, 200);
  };

  const finishLoading = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    setProgress(100);
    finishRef.current = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 380);
  };

  return (
    <>
      {/* Top progress bar — always on top */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="fixed top-0 left-0 right-0 z-[200] h-[3px] bg-gray-100"
          >
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary via-fuchsia-500 to-accent rounded-r-full shadow-[0_0_10px_2px_rgba(255,87,51,0.5)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Frosted glass overlay + centered loader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[199] flex items-center justify-center"
            aria-live="polite"
            aria-busy="true"
          >
            {/* Blur backdrop */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />

            {/* Loader card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative flex flex-col items-center gap-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white px-8 py-7"
            >
              {/* Spinning ring */}
              <div className="relative w-14 h-14">
                <svg
                  className="w-14 h-14 -rotate-90"
                  viewBox="0 0 56 56"
                  fill="none"
                >
                  <circle
                    cx="28" cy="28" r="24"
                    stroke="#f0f0f0"
                    strokeWidth="4"
                  />
                  <motion.circle
                    cx="28" cy="28" r="24"
                    stroke="url(#loaderGrad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="150.8"
                    animate={{ strokeDashoffset: [150.8, 0] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <defs>
                    <linearGradient id="loaderGrad" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FF5733" />
                      <stop offset="1" stopColor="#d946ef" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Initials in center */}
                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-navy font-display">
                  AR
                </span>
              </div>

              {/* Progress percentage */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-navy font-semibold text-sm tracking-wide">
                  Loading page…
                </span>
                <motion.span
                  key={Math.round(progress)}
                  className="text-xs text-text-muted tabular-nums"
                >
                  {Math.min(Math.round(progress), 100)}%
                </motion.span>
              </div>

              {/* Mini progress bar inside card */}
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-fuchsia-500 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
