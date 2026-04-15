"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiChevronRight } from "react-icons/fi";

export default function AboutHero() {
  return (
    <section className="relative pt-40 pb-24 bg-gradient-to-b from-navy-dark via-navy to-navy-light overflow-hidden">
      {/* Radial glow like hero */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[720px] h-[720px] rounded-full bg-[radial-gradient(circle,rgba(66,86,180,0.45)_0%,rgba(11,20,55,0)_65%)]" />
      </div>

      {/* Decorative dots */}
      <div className="absolute top-28 right-24 w-2 h-2 rounded-full bg-primary animate-pulse" />
      <div className="absolute bottom-16 left-16 w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />

      <div className="section-container text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl md:text-7xl lg:text-8xl font-extrabold font-display tracking-tight text-white"
        >
          About <span className="text-primary">Me</span>
        </motion.h1>

        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 inline-flex items-center gap-1 text-sm text-white/70"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <FiChevronRight className="text-primary" />
          <span className="text-primary font-semibold">About</span>
        </motion.nav>
      </div>
    </section>
  );
}
