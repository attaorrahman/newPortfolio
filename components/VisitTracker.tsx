"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "pf_session";

function getSessionId() {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Skip admin routes from tracking
    if (pathname?.startsWith("/admin")) return;

    const payload = {
      path: pathname || "/",
      referrer: document.referrer || null,
      sessionId: getSessionId(),
    };

    // navigator.sendBeacon survives page unload; fall back to fetch.
    try {
      const blob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
      });
      if (navigator.sendBeacon?.("/api/track", blob)) return;
    } catch {
      /* fall through */
    }
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
