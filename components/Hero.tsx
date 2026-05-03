"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { HiOutlineMail, HiOutlineEye } from "react-icons/hi";
import { FiDownload } from "react-icons/fi";
import { heroStats, profile, resumeUrl, socials } from "@/lib/data";
import Typewriter from "./Typewriter";
import TechMarquee from "./TechMarquee";

const ResumeViewer = dynamic(() => import("./ResumeViewer"), { ssr: false });

const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedinIn,
  Email: HiOutlineMail,
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const rotatingRoles = [
  "AI Powered Full-Stack Developer",
  "React.js Specialist",
  "Next.js Engineer",
  "Node.js + API Builder",
  "MERN Stack Developer",
];

export default function Hero() {
  const [previewOpen, setPreviewOpen] = useState(false);
  return (
    <section
      id="home"
      className="relative min-h-screen bg-gradient-to-b from-navy-dark via-navy to-navy-light pt-20 pb-0 overflow-hidden"
    >
      {/* Animated grid background */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* Radial glow behind portrait */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-[720px] h-[720px] rounded-full bg-[radial-gradient(circle,rgba(66,86,180,0.45)_0%,rgba(11,20,55,0)_65%)]"
        />
      </div>

      {/* Decorative dots */}
      <div className="absolute top-40 right-20 w-2 h-2 rounded-full bg-primary animate-pulse" />
      <div className="absolute bottom-40 left-16 w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />

      <div className="section-container relative z-10 grid grid-cols-12 gap-8 items-center min-h-[58vh] px-6 md:px-10 lg:px-12">
        {/* Left info cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="col-span-12 lg:col-span-3 space-y-4 order-2 lg:order-1"
        >
          <motion.div
            variants={fadeUp}
            custom={1}
            className="bg-navy-light/60 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-white font-semibold text-sm">
                <Typewriter words={rotatingRoles} className="inline-block" />
              </span>
            </div>
            <p className="text-white/60 text-xs pl-3.5">{profile.location}</p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={2}
            className="bg-navy-light/60 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-white font-semibold text-sm">Say hello to</span>
            </div>
            <a
              href={`mailto:${profile.email}`}
              className="text-white/60 text-xs pl-3.5 hover:text-primary transition-colors break-all"
            >
              {profile.email}
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={3}
            className="bg-emerald-500/10 backdrop-blur-sm border border-emerald-400/30 rounded-xl px-5 py-3 shadow-lg flex items-center gap-2.5"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <span className="text-emerald-200 text-xs font-semibold">
              Available for new projects
            </span>
          </motion.div>

          <motion.div variants={fadeUp} custom={4} className="flex gap-2 pt-1 pl-1">
            {socials.map((s) => {
              const Icon = socialIconMap[s.label];
              if (!Icon) return null;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-primary border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all duration-300"
                >
                  <Icon className="text-xs" />
                </a>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Center portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="col-span-12 lg:col-span-6 order-1 lg:order-2 flex items-end justify-center relative"
        >
          <div className="relative">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 drop-shadow-2xl"
            >
              <Image
                src="/AR Logo7.png"
                alt={profile.fullName}
                width={440}
                height={440}
                priority
                sizes="(max-width: 768px) 280px, (max-width: 1024px) 360px, 440px"
                className="max-h-[380px] md:max-h-[420px] lg:max-h-[440px] w-auto object-contain"
              />
            </motion.div>
            <span className="absolute top-12 right-0 w-2.5 h-4 rounded-full bg-primary shadow-lg shadow-primary/60" />
          </div>
        </motion.div>

        {/* Right stats */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="col-span-12 lg:col-span-3 space-y-10 order-3 lg:text-right"
        >
          {heroStats.map((stat, i) => (
            <motion.div key={stat.label} variants={fadeUp} custom={i + 1}>
              <div className="text-white text-5xl lg:text-[54px] font-bold font-display leading-none">
                {stat.value}
              </div>
              <div className="text-white/60 text-xs mt-2 tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Name banner */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="section-container relative z-20 mt-6 text-center px-6 md:px-10 lg:px-12 pb-10"
      >
        <h1 className="text-white text-[40px] sm:text-[52px] md:text-[64px] lg:text-[76px] font-extrabold font-display tracking-tight leading-[1.05]">
          {profile.firstName} <span className="text-primary">{profile.lastName}</span>
        </h1>
        <p className="text-white/70 mt-3 text-sm md:text-base">
          Do you have a project?{" "}
          <a
            href="#contact"
            className="text-primary font-semibold underline-offset-4 hover:underline"
          >
            Let's Talk
          </a>
        </p>

        <div className="mt-7 flex items-center justify-center gap-3 flex-wrap">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            href={resumeUrl}
            download
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-7 py-3 rounded-full font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow"
          >
            <FiDownload /> Download CV
          </motion.a>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPreviewOpen(true)}
            aria-label="Preview resume"
            title="Preview resume"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/15 border border-white/20 text-white px-5 py-3 rounded-full font-semibold backdrop-blur-sm transition-colors"
          >
            <HiOutlineEye className="text-lg" /> Preview
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            href="#contact"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white px-7 py-3 rounded-full font-semibold backdrop-blur-sm transition-colors"
          >
            Contact Me
          </motion.a>
        </div>

        <ResumeViewer open={previewOpen} onClose={() => setPreviewOpen(false)} />
      </motion.div>

      {/* Tech stack marquee */}
      <TechMarquee />
    </section>
  );
}
