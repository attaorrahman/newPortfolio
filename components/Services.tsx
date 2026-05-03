"use client";

import { motion } from "framer-motion";
import { HiOutlineDesktopComputer } from "react-icons/hi";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { IoColorPaletteOutline } from "react-icons/io5";
import { FiArrowUpRight } from "react-icons/fi";
import { services } from "@/lib/data";

const iconMap = {
  desktop: HiOutlineDesktopComputer,
  mobile: HiOutlineDevicePhoneMobile,
  brand: IoColorPaletteOutline,
};

export default function Services() {
  return (
    <section id="services" className="py-24 bg-gray-50 relative">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-primary font-semibold text-sm tracking-wider">
              Services
            </span>
            <span className="text-lg">⚙️</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-navy font-display">
            How can <span className="text-primary">I help you</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s, i) => {
            const Icon = iconMap[s.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden"
              >
                {/* Icon */}
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                  <Icon className="text-2xl text-navy group-hover:text-primary transition-colors" />
                </div>

                <div className="text-xs text-primary font-semibold tracking-wider mb-2">
                  {s.projects} PROJECTS
                </div>
                <h3 className="text-xl font-bold text-navy mb-3 font-display">
                  {s.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed mb-6">
                  {s.description}
                </p>

                <div className="flex items-center justify-between text-xs">
                  <a
                    href="#"
                    className="text-navy font-semibold hover:text-primary transition-colors"
                  >
                    Explore
                  </a>
                </div>

                {/* Arrow */}
                <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                  <FiArrowUpRight />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
