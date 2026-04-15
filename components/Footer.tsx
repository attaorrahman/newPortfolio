"use client";

import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";
import { navLinks, profile, socials } from "@/lib/data";

const footerIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedinIn,
  X: FaXTwitter,
  Email: HiOutlineMail,
};

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-white pt-20 pb-8">
      <div className="section-container">
        <div className="grid md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          <div className="md:col-span-2">
            <a href="#home" className="flex items-center gap-2 mb-4">
              <svg width="34" height="30" viewBox="0 0 34 30" fill="none">
                <path d="M17 2 L32 28 L22 28 L17 19 L12 28 L2 28 Z" fill="#FF5733" />
              </svg>
              <span className="text-2xl font-bold">
                Port<span className="text-primary">m</span>
              </span>
            </a>
            <p className="text-white/60 max-w-md leading-relaxed mb-6">
              Front-End Developer crafting responsive, high-performance web
              experiences with React.js and Next.js. Available for freelance &
              full-time roles.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => {
                const Icon = footerIconMap[s.label];
                if (!Icon) return null;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    aria-label={s.label}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary border border-white/10 flex items-center justify-center transition-all"
                  >
                    <Icon className="text-sm" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-white/60">
              {navLinks.map((l) => (
                <li key={l.name}>
                  <a href={l.href} className="hover:text-primary transition-colors">
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a href={`mailto:${profile.email}`} className="hover:text-primary transition-colors break-all">
                  {profile.email}
                </a>
              </li>
              <li>{profile.phone}</li>
              <li>{profile.location}</li>
              <li>
                <a href={`https://${profile.website}`} className="hover:text-primary transition-colors">
                  {profile.website}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-white/50">
          <p>© {new Date().getFullYear()} Portm. All rights reserved.</p>
          <p>
            Designed with <span className="text-primary">♥</span> by{" "}
            {profile.fullName}
          </p>
        </div>
      </div>
    </footer>
  );
}
