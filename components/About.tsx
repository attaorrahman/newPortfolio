"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiRedux,
  SiJavascript,
  SiTypescript,
  SiTailwindcss,
  SiMui,
  SiBootstrap,
  SiMongodb,
  SiGit,
  SiGithub,
  SiFirebase,
  SiStripe,
  SiFigma,
  SiExpress,
} from "react-icons/si";
import { aboutTabs, aboutContent } from "@/lib/data";

const tools = [
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", Icon: SiNextdotjs, color: "#000000" },
  { name: "Node.js", Icon: SiNodedotjs, color: "#339933" },
  { name: "Express", Icon: SiExpress, color: "#000000" },
  { name: "Redux", Icon: SiRedux, color: "#764ABC" },
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "Tailwind", Icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Material UI", Icon: SiMui, color: "#007FFF" },
  { name: "Bootstrap", Icon: SiBootstrap, color: "#7952B3" },
  { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
  { name: "Git", Icon: SiGit, color: "#F05032" },
  { name: "GitHub", Icon: SiGithub, color: "#181717" },
  { name: "Firebase", Icon: SiFirebase, color: "#FFCA28" },
  { name: "Stripe", Icon: SiStripe, color: "#635BFF" },
  { name: "Figma", Icon: SiFigma, color: "#F24E1E" },
];

export default function About() {
  const [tab, setTab] = useState<(typeof aboutTabs)[number]>("MYSELF");

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* decorative dots */}
      <div className="absolute top-20 right-10 grid grid-cols-5 gap-2 opacity-30">
        {Array.from({ length: 25 }).map((_, i) => (
          <span key={i} className="w-1 h-1 rounded-full bg-primary" />
        ))}
      </div>

      <div className="section-container grid lg:grid-cols-2 gap-16 items-center">
        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="relative max-w-md mx-auto">
            {/* Outer rounded card wrapper */}
            <div className="relative rounded-[36px] bg-white p-4 shadow-xl">
              {/* Blue card with WAVING gradient background */}
              <div className="relative rounded-[28px] overflow-hidden h-[460px]">
                {/* Base blue */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#2947A9] via-[#1E3A8A] to-[#0F2B6B]" />

                {/* Animated wave band 1 — moves top→bottom */}
                <motion.div
                  animate={{ y: ["-100%", "100%"] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-sky-300/25 to-transparent"
                />

                {/* Animated wave band 2 — moves bottom→top (opposite direction) */}
                <motion.div
                  animate={{ y: ["100%", "-100%"] }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.2,
                  }}
                  className="absolute inset-x-0 h-1/2 bg-gradient-to-t from-transparent via-indigo-400/20 to-transparent"
                />

                {/* Soft glow blob */}
                <motion.div
                  animate={{
                    y: [0, -30, 0, 30, 0],
                    x: [0, 15, 0, -15, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-sky-400/20 blur-3xl pointer-events-none"
                />

                {/* Portrait */}
                <img
                  src="/AR Logo7.png"
                  alt="Atta Ur Rahman"
                  className="relative z-10 w-full h-full object-contain object-bottom drop-shadow-2xl"
                />

                {/* Subtle bottom fade */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0F2B6B]/80 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Happy clients badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl px-5 py-3 flex items-center gap-3"
            >
              <span className="text-2xl">😍</span>
              <div>
                <div className="text-2xl font-bold text-navy">30+</div>
                <div className="text-xs text-text-muted">Happy Clients</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Content side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-primary font-semibold text-sm tracking-wider">
              About Me
            </span>
            <span className="text-lg">💡</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-navy font-display leading-tight mb-8">
            Why <span className="text-primary">hire me</span>
            <br />
            for your <span className="text-primary">next</span>
            <br />
            web project?
          </h2>

          {/* Tabs */}
          <div className="flex gap-8 border-b border-gray-200 mb-6">
            {aboutTabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative pb-3 text-sm font-semibold tracking-wide transition-colors ${
                  tab === t ? "text-primary" : "text-text-muted hover:text-navy"
                }`}
              >
                {t}
                {tab === t && (
                  <motion.span
                    layoutId="aboutTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "MY TOOLS" ? (
              <motion.div
                key="tools-grid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="mb-8"
              >
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {tools.map((tool, i) => (
                    <motion.div
                      key={tool.name}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: i * 0.04,
                        type: "spring",
                        stiffness: 260,
                        damping: 18,
                      }}
                      whileHover={{ y: -4, scale: 1.08 }}
                      className="group relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-gray-50 hover:bg-white hover:shadow-lg border border-transparent hover:border-gray-100 transition-all"
                      title={tool.name}
                    >
                      <tool.Icon
                        className="text-3xl transition-transform"
                        style={{ color: tool.color }}
                      />
                      <span className="text-[10px] text-text-muted group-hover:text-navy font-medium truncate max-w-full">
                        {tool.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.p
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="text-text-muted leading-relaxed mb-8"
              >
                {aboutContent[tab]}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            href="#contact"
            className="inline-flex bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-primary/30"
          >
            Hire Me
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
