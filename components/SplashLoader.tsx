"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SESSION_KEY = "splash_seen";

export default function SplashLoader() {
  // Show on every full page load, but not on client-side route changes within
  // the same session. (Set initial=true so it's visible during hydration.)
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Already seen in this tab/session → hide immediately.
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY)) {
      setVisible(false);
      return;
    }

    let dismissed = false;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      sessionStorage.setItem(SESSION_KEY, "1");
      // Tiny delay so the splash is perceptible even on fast loads.
      setTimeout(() => setVisible(false), 250);
    };

    // Hide once everything (images/fonts/styles) is ready.
    if (document.readyState === "complete") {
      // Defer one frame so we don't flash-and-disappear.
      requestAnimationFrame(dismiss);
    } else {
      window.addEventListener("load", dismiss, { once: true });
    }

    // Hard cap: never block the user for more than 2.5 s.
    const cap = setTimeout(dismiss, 2500);
    return () => {
      clearTimeout(cap);
      window.removeEventListener("load", dismiss);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: "easeOut" } }}
          aria-hidden
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-gradient-to-br from-navy-dark via-navy to-navy-light overflow-hidden"
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage:
                "radial-gradient(ellipse at center, black 30%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            }}
          />

          {/* Pulsing radial glow */}
          <motion.div
            animate={{ scale: [1, 1.18, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,87,51,0.35)_0%,rgba(11,20,55,0)_65%)]"
          />

          {/* Center content */}
          <div className="relative flex flex-col items-center">
            {/* Animated monogram */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              <svg
                width="86"
                height="78"
                viewBox="0 0 34 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-[0_0_30px_rgba(255,87,51,0.55)]"
              >
                <motion.path
                  initial={{ pathLength: 0, fillOpacity: 0 }}
                  animate={{ pathLength: 1, fillOpacity: 1 }}
                  transition={{
                    pathLength: { duration: 1.1, ease: "easeInOut" },
                    fillOpacity: { delay: 0.7, duration: 0.5 },
                  }}
                  d="M17 2 L32 28 L22 28 L17 19 L12 28 L2 28 Z"
                  fill="url(#splashLogoGrad)"
                  stroke="#FF7A55"
                  strokeWidth="0.5"
                />
                <defs>
                  <linearGradient
                    id="splashLogoGrad"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#FF5733" />
                    <stop offset="100%" stopColor="#FF8A5C" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-5 text-white font-display font-extrabold tracking-tight text-2xl"
            >
              Atta Ur <span className="text-primary">Rahman</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-white text-[11px] tracking-[0.25em] uppercase mt-2"
            >
              Full-Stack Developer
            </motion.p>

            {/* Progress bar */}
            <div className="mt-7 w-44 h-[3px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-full w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
