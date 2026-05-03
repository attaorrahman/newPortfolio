"use client";

import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiTailwindcss,
  SiRedux,
  SiMui,
  SiFirebase,
  SiStripe,
  SiGit,
  SiGithub,
  SiFigma,
  SiBootstrap,
} from "react-icons/si";

const items = [
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", Icon: SiNextdotjs, color: "#ffffff" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  { name: "Node.js", Icon: SiNodedotjs, color: "#3C873A" },
  { name: "Express", Icon: SiExpress, color: "#ffffff" },
  { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
  { name: "Tailwind", Icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Redux", Icon: SiRedux, color: "#764ABC" },
  { name: "Material UI", Icon: SiMui, color: "#007FFF" },
  { name: "Bootstrap", Icon: SiBootstrap, color: "#7952B3" },
  { name: "Firebase", Icon: SiFirebase, color: "#FFCA28" },
  { name: "Stripe", Icon: SiStripe, color: "#635BFF" },
  { name: "Git", Icon: SiGit, color: "#F05032" },
  { name: "GitHub", Icon: SiGithub, color: "#ffffff" },
  { name: "Figma", Icon: SiFigma, color: "#F24E1E" },
];

export default function TechMarquee() {
  const doubled = [...items, ...items];

  return (
    <div className="relative w-full overflow-hidden border-y border-white/10 bg-navy-dark/40 backdrop-blur-sm">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-navy-dark to-transparent z-10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-navy-dark to-transparent z-10"
        aria-hidden
      />

      <div className="marquee-track flex items-center gap-12 py-5">
        {doubled.map(({ name, Icon, color }, i) => (
          <div
            key={`${name}-${i}`}
            className="flex items-center gap-2.5 text-white/70 hover:text-white transition-colors whitespace-nowrap"
            title={name}
          >
            <Icon className="text-2xl" style={{ color }} />
            <span className="text-sm font-medium tracking-wide">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
