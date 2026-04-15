"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { projects } from "@/lib/data";
import ProjectCard from "./ProjectCard";

export default function Portfolio() {
  const featured = projects.slice(0, 3);

  return (
    <section
      id="portfolio"
      className="py-24 bg-navy-dark relative overflow-hidden"
    >
      {/* Ambient glows */}
      <div className="hero-glow -top-40 -left-20 opacity-50" />
      <div className="hero-glow bottom-0 right-0 opacity-40" />

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-4 gap-6 items-stretch">
          {/* Heading block */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-primary font-semibold text-sm tracking-wider">
                Portfolio
              </span>
              <span className="text-lg">🎨</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-white font-display leading-[1.05]">
              My latest <br />
              <span className="text-primary">Projects</span>
            </h2>
            <p className="text-white/60 mt-4 text-sm leading-relaxed max-w-xs">
              A selection of dashboards, marketplaces and full-stack apps
              shipped across React, Next.js and Node.
            </p>
          </motion.div>

          {/* 3 Featured projects */}
          {featured.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-primary font-semibold text-lg underline-offset-4 hover:underline"
          >
            View All Projects <FiArrowUpRight />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
