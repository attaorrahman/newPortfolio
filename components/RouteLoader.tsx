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

  // Intercept link clicks anywhere on the page
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
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
      )
        return;
      if (href.startsWith("#")) return;

      // Strip the hash for current-path comparison
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

  // When pathname/search changes, finish progress
  useEffect(() => {
    if (loading) finishLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams?.toString()]);

  const startLoading = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (finishRef.current) clearTimeout(finishRef.current);
    setProgress(8);
    setLoading(true);

    tickRef.current = setInterval(() => {
      setProgress((p) => {
        if (p < 70) return p + Math.random() * 8;
        if (p < 90) return p + Math.random() * 1.5;
        return p;
      });
    }, 220);
  };

  const finishLoading = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    setProgress(100);
    finishRef.current = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 350);
  };

  return (
    <>
      {/* Top progress bar */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed top-0 left-0 right-0 z-[100] pointer-events-none"
          >
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="h-[3px] bg-gradient-to-r from-primary via-fuchsia-500 to-accent shadow-[0_0_12px_rgba(255,87,51,0.7)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle backdrop + center spinner */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99] pointer-events-none flex items-center justify-center"
            aria-live="polite"
            aria-busy="true"
          >
            <div className="absolute inset-0 bg-navy-dark/30 backdrop-blur-[2px]" />
            <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-3 border border-white">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
              </span>
              <span className="text-navy font-semibold text-sm tracking-wide">
                Loading…
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
