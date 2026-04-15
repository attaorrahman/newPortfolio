"use client";

import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  SiReact,
  SiNextdotjs,
  SiJavascript,
  SiTypescript,
  SiRedux,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiMui,
  SiBootstrap,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiVercel,
  SiNetlify,
  SiJira,
  SiGithub,
  SiPostman,
  SiOpenai,
  SiFramer,
} from "react-icons/si";
import { FiZap } from "react-icons/fi";

type Skill = {
  name: string;
  icon: IconType;
  color: string;
};

type Cluster = {
  title: string;
  skills: Skill[];
};

const frontend: Skill[] = [
  { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
  { name: "CSS3", icon: SiCss, color: "#1572B6" },
  { name: "Bootstrap", icon: SiBootstrap, color: "#7952B3" },
  { name: "Redux", icon: SiRedux, color: "#764ABC" },
  { name: "Material UI", icon: SiMui, color: "#007FFF" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { name: "React.js", icon: SiReact, color: "#61DAFB" },
  { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Next.js", icon: SiNextdotjs, color: "#111827" },
];

const backend: Skill[] = [
  { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "Express", icon: SiExpress, color: "#111827" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
];

const tools: Skill[] = [
  { name: "Vercel", icon: SiVercel, color: "#111827" },
  { name: "Thunder Client", icon: FiZap, color: "#7B68EE" },
  { name: "Netlify", icon: SiNetlify, color: "#00C7B7" },
  { name: "Jira", icon: SiJira, color: "#0052CC" },
  { name: "GitHub", icon: SiGithub, color: "#111827" },
  { name: "Postman", icon: SiPostman, color: "#FF6C37" },
  { name: "OpenAI API", icon: SiOpenai, color: "#111827" },
  { name: "Framer Motion", icon: SiFramer, color: "#0055FF" },
];

const clusters: Cluster[] = [
  { title: "Frontend", skills: frontend },
  { title: "Backend", skills: backend },
  { title: "Tools", skills: tools },
];

function SkillOrbit({ cluster, radius }: { cluster: Cluster; radius: number }) {
  const size = (radius + 50) * 2;
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <motion.div
        className="absolute rounded-full"
        style={{
          width: radius * 2,
          height: radius * 2,
          top: "1%",
          left: "4%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {cluster.skills.map((skill, i) => {
          const angle = (i * 2 * Math.PI) / cluster.skills.length - Math.PI / 2;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          const Icon = skill.icon;
          return (
            <motion.div
              key={skill.name}
              className="absolute flex flex-col items-center gap-1.5"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ scale: 1.15 }}
            >
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center">
                <Icon className="text-2xl md:text-3xl" style={{ color: skill.color }} />
              </div>
              <span className="text-[10px] md:text-xs text-navy font-semibold whitespace-nowrap bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
                {skill.name}
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        className="relative z-10 w-40 h-16 md:w-30 md:h-20 flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-bold shadow-2xl shadow-pink-500/30"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="font-display text-lg md:text-xl tracking-wide">
          {cluster.title}
        </span>
      </motion.div>
    </div>
  );
}

export default function Skills() {
  return (
    <section
      id="skills"
      className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden"
    >
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-fuchsia-500/5 rounded-full blur-3xl" />

      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-primary font-semibold text-sm tracking-wider">
              Skills
            </span>
            <span className="text-lg">🛠️</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-navy font-display">
            My <span className="text-primary">tech stack</span>
          </h2>
          <p className="text-text-muted mt-4 max-w-2xl mx-auto">
            The tools I use day-to-day to ship clean, scalable and performant
            web applications.
          </p>
        </motion.div>

        {/* Desktop: three orbits laid out with Frontend top-center, Backend left, Tools right */}
        <div className="hidden lg:grid grid-cols-2 gap-y-1 gap-x-8 place-items-center pt-1">
          <div className="col-span-2 flex justify-center">
            <SkillOrbit cluster={clusters[0]} radius={170} />
          </div>
          <div className="flex justify-center">
            <SkillOrbit cluster={clusters[1]} radius={130} />
          </div>
          <div className="flex justify-center">
            <SkillOrbit cluster={clusters[2]} radius={150} />
          </div>
        </div>

        {/* Mobile/tablet: stacked orbits */}
        <div className="lg:hidden flex flex-col items-center gap-20 py-8">
          <SkillOrbit cluster={clusters[0]} radius={120} />
          <SkillOrbit cluster={clusters[1]} radius={100} />
          <SkillOrbit cluster={clusters[2]} radius={115} />
        </div>
      </div>
    </section>
  );
}
