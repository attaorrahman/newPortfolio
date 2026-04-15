"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const RING_SIZE = 36;
const DOT_SIZE = 6;

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  // Outer ring — slower spring => trails behind with a small lag
  const ringX = useSpring(mouseX, { damping: 22, stiffness: 170, mass: 0.6 });
  const ringY = useSpring(mouseY, { damping: 22, stiffness: 170, mass: 0.6 });

  // Inner dot — very tight spring => nearly on the pointer
  const dotX = useSpring(mouseX, { damping: 30, stiffness: 900, mass: 0.25 });
  const dotY = useSpring(mouseY, { damping: 30, stiffness: 900, mass: 0.25 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setEnabled(mq.matches);
    if (!mq.matches) return;

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      setHovering(
        !!t?.closest("a, button, [role='button'], input, textarea, label")
      );
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <>
      {/* Outer trailing ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          marginLeft: -RING_SIZE / 2,
          marginTop: -RING_SIZE / 2,
          width: RING_SIZE,
          height: RING_SIZE,
        }}
        animate={{
          scale: hovering ? 1.6 : 1,
          borderColor: hovering ? "rgba(255,87,51,0.95)" : "rgba(255,87,51,0.6)",
          backgroundColor: hovering
            ? "rgba(255,87,51,0.15)"
            : "rgba(255,87,51,0)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="fixed top-0 left-0 rounded-full border-2 pointer-events-none z-[9999]"
      />

      {/* Inner tight dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          marginLeft: -DOT_SIZE / 2,
          marginTop: -DOT_SIZE / 2,
          width: DOT_SIZE,
          height: DOT_SIZE,
        }}
        className="fixed top-0 left-0 rounded-full bg-primary pointer-events-none z-[9999]"
      />
    </>
  );
}
