"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FiDownload } from "react-icons/fi";
import { navLinks, resumeUrl } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("Home");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: { name: string; href: string }
  ) => {
    setActive(link.name);
    setMobileOpen(false);

    // Links with hash anchors on the home page
    if (link.href.startsWith("/#")) {
      const anchor = link.href.slice(1); // e.g. "#home"
      if (pathname === "/") {
        // Already on home — just scroll
        e.preventDefault();
        document.querySelector(anchor)?.scrollIntoView({ behavior: "smooth" });
      } else {
        // Navigate to home page; browser will handle the hash scroll
        e.preventDefault();
        router.push(link.href);
      }
    }
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="section-container flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <svg
            width="34"
            height="30"
            viewBox="0 0 34 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 2 L32 28 L22 28 L17 19 L12 28 L2 28 Z"
              fill="url(#logoGrad)"
            />
            <path d="M17 8 L24 22 L17 22 Z" fill="#ffffff" opacity="0.15" />
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF5733" />
                <stop offset="100%" stopColor="#FF8A5C" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-xl font-bold text-white tracking-tight">
            Atta Ur <span className="text-primary">Rahman</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className={`relative text-sm font-medium transition-colors duration-200 ${
                  active === link.name
                    ? "text-primary"
                    : "text-white/90 hover:text-primary"
                }`}
              >
                {link.name}
                {active === link.name && (
                  <motion.span
                    layoutId="activeIndicator"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            href={resumeUrl}
            download
            title="Download CV"
            className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow"
          >
            <FiDownload className="text-base" />
            Download CV
          </motion.a>

          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((s) => !s)}
            className="lg:hidden text-white text-2xl"
          >
            {mobileOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-navy-dark/95 backdrop-blur-md"
          >
            <ul className="flex flex-col px-6 py-6 gap-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className="block text-white/90 hover:text-primary font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <a
                href={resumeUrl}
                download
                className="mt-2 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-6 py-2.5 rounded-full font-semibold text-sm"
              >
                <FiDownload /> Download CV
              </a>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
