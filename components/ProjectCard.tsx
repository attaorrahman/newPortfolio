"use client";

import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
import { FaGithub, FaLock } from "react-icons/fa";
import type { Project } from "@/lib/data";

type Props = {
  project: Project;
  index?: number;
};

export default function ProjectCard({ project, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.1 }}
      whileHover={{ y: -10 }}
      className={`group relative rounded-3xl overflow-hidden aspect-[4/5] bg-gradient-to-br ${project.gradient} shadow-2xl`}
    >
      {/* Screenshot blended into gradient */}
      <img
        src={project.image}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover object-top mix-blend-overlay opacity-90 group-hover:scale-110 transition-transform duration-700"
      />

      {/* Hover sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Dark fade at bottom for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Confidential badge */}
      {project.confidential && (
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm border border-white/20 text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full">
          <FaLock className="text-[9px]" /> Private
        </div>
      )}

      {/* Top-right quick actions */}
      <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {project.links.repo && (
          <a
            href={project.links.repo}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            onClick={(e) => e.stopPropagation()}
            className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-navy transition-colors"
          >
            <FaGithub className="text-sm" />
          </a>
        )}
        <a
          href={project.links.live}
          target="_blank"
          rel="noreferrer"
          aria-label="Live demo"
          onClick={(e) => e.stopPropagation()}
          className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-colors"
        >
          <FiExternalLink className="text-sm" />
        </a>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-white font-bold text-2xl lg:text-[26px] font-display leading-tight mb-1.5">
          {project.title}
        </h3>
        <p className="text-white/80 text-xs leading-relaxed mb-3 line-clamp-2">
          {project.tagline}
        </p>

        {/* Tech pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="text-[10px] text-white/90 bg-white/15 backdrop-blur-sm border border-white/20 px-2 py-0.5 rounded-full"
            >
              {t}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="text-[10px] text-white/70 px-2 py-0.5">
              +{project.tech.length - 4}
            </span>
          )}
        </div>

        {/* Action row */}
        <div className="flex items-center gap-2 border-t border-white/25 pt-3">
          <a
            href={project.links.live}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-white text-xs font-bold tracking-[0.12em] hover:text-primary transition-colors"
          >
            LIVE DEMO
            <FiExternalLink className="text-sm" />
          </a>
          {project.links.repo && (
            <>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <a
                href={project.links.repo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-white text-xs font-bold tracking-[0.12em] hover:text-primary transition-colors"
              >
                GITHUB
                <FaGithub className="text-sm" />
              </a>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
