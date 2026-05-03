"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { RiDoubleQuotesL } from "react-icons/ri";
import { testimonials } from "@/lib/data";

const PALETTE = [
  "from-rose-500 to-orange-500",
  "from-indigo-500 to-violet-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-yellow-500",
];

function Monogram({
  name,
  index,
  size = 40,
}: {
  name: string;
  index: number;
  size?: number;
}) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full bg-gradient-to-br ${
        PALETTE[index % PALETTE.length]
      } flex items-center justify-center text-white font-bold shadow-md`}
      aria-hidden
    >
      <span className="text-sm">{initials}</span>
    </div>
  );
}

export default function AboutTestimonials() {
  return (
    <section className="py-20 bg-primary/5 relative overflow-hidden">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-primary font-semibold text-sm tracking-wider">
                Testimonials
              </span>
              <span className="text-lg">💬</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-navy leading-tight">
              What <span className="text-primary">my clients</span> have
              <br />
              to say <span className="text-fuchsia-600">about me</span>
            </h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline self-start md:self-auto"
          >
            View All Projects <FiArrowUpRight />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.slice(0, 2).map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg shadow-primary/5 border border-white"
            >
              <RiDoubleQuotesL className="text-primary text-3xl mb-3" />
              <p className="text-text-muted leading-relaxed mb-6">{t.quote}</p>
              <div className="flex items-center gap-3">
                <Monogram name={t.name} index={i} size={48} />
                <div>
                  <div className="text-navy font-bold">{t.name}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
