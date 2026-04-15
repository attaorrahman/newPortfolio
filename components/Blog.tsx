"use client";

import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { articles } from "@/lib/data";

export default function Blog() {
  return (
    <section id="blog" className="py-24 bg-gradient-to-br from-pink-50/40 to-white relative">
      <div className="section-container grid lg:grid-cols-3 gap-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-1"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-primary font-semibold text-sm tracking-wider">
              Blog Posts
            </span>
            <span className="text-lg">✏️</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-navy font-display leading-tight mb-6">
            My Latest <br />
            <span className="text-primary">articles</span>
          </h2>
          <p className="text-text-muted leading-relaxed mb-6">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
            commodo ligula eget dolor. Aenean massa.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-primary font-semibold tracking-wider text-sm"
          >
            VIEW ALL <FiArrowUpRight />
          </a>
        </motion.div>

        {/* Articles list */}
        <div className="lg:col-span-2 space-y-6">
          {articles.map((a, i) => (
            <motion.a
              key={a.id}
              href="#"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ x: 4 }}
              className="group flex items-center gap-6 border-b border-gray-200 pb-6"
            >
              <div className="flex-shrink-0 text-center w-14">
                <div className="text-3xl font-bold text-navy font-display">
                  {a.day}
                </div>
                <div className="text-xs text-text-muted">{a.month}</div>
              </div>

              <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xs text-text-muted mb-1">{a.readTime}</div>
                <h3 className="text-navy font-semibold font-display group-hover:text-primary transition-colors line-clamp-2">
                  {a.title}
                </h3>
              </div>

              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-navy group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                <FiArrowUpRight />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
