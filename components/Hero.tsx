"use client";

import { motion } from "framer-motion";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";
import { FiDownload } from "react-icons/fi";
import { heroStats, profile, resumeUrl, socials } from "@/lib/data";

const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedinIn,
  X: FaXTwitter,
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

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen bg-gradient-to-b from-navy-dark via-navy to-navy-light pt-20 pb-10 overflow-hidden"
    >
      {/* Radial glow behind portrait */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[720px] h-[720px] rounded-full bg-[radial-gradient(circle,rgba(66,86,180,0.45)_0%,rgba(11,20,55,0)_65%)]" />
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
              <span className="text-white font-semibold text-sm">{profile.role}</span>
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

          <motion.div variants={fadeUp} custom={3} className="flex gap-2 pt-2 pl-1">
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
            <img
              src="/AR Logo7.png"
              alt={profile.fullName}
              className="relative z-10 max-h-[380px] md:max-h-[420px] lg:max-h-[440px] w-auto object-contain drop-shadow-2xl"
            />
            {/* Accent dot */}
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

      {/* Name banner overlapping bottom */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="section-container relative z-20 mt-6 text-center px-6 md:px-10 lg:px-12"
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

        <div className="mt-7 flex items-center justify-center gap-4 flex-wrap">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            href={resumeUrl}
            download
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-7 py-3 rounded-full font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow"
          >
            <FiDownload /> Download CV
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            href="#contact"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white px-7 py-3 rounded-full font-semibold backdrop-blur-sm transition-colors"
          >
            Contact Me
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
