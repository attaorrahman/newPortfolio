"use client";

import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import { testimonials } from "@/lib/data";

const PALETTE = [
  "from-rose-500 to-orange-500",
  "from-indigo-500 to-violet-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-yellow-500",
  "from-sky-500 to-blue-500",
  "from-pink-500 to-fuchsia-500",
];

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).slice(0, 2);
  return words.map((w) => w[0]?.toUpperCase()).join("");
}

function Monogram({ name, index }: { name: string; index: number }) {
  const palette = PALETTE[index % PALETTE.length];
  return (
    <div
      className={`w-10 h-10 rounded-full bg-gradient-to-br ${palette} flex items-center justify-center text-white font-bold text-sm shadow-md`}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
      {/* decorative hearts */}
      <div className="absolute bottom-10 right-10 text-pink-300 text-2xl opacity-60">
        ❤️ ❤️ ❤️
      </div>

      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-primary font-semibold text-sm tracking-wider">
              Testimonials
            </span>
            <span className="text-lg">💬</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-navy font-display">
            What my <span className="text-primary">clients say</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow relative"
            >
              <FaQuoteLeft className="text-primary/30 text-3xl mb-3" />
              <p className="text-text-muted leading-relaxed mb-5 text-sm">
                {t.quote}
              </p>
              <div className="flex items-center gap-3">
                <Monogram name={t.name} index={i} />
                <div>
                  <div className="font-semibold text-navy text-sm">
                    {t.name}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
