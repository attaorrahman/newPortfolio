"use client";

import { motion } from "framer-motion";
import { HiOutlineBriefcase } from "react-icons/hi";
import { experience, certifications } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" className="py-24 bg-gray-50 relative">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-primary font-semibold text-sm tracking-wider">
              Experience
            </span>
            <span className="text-lg">💼</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-navy font-display">
            Where <span className="text-primary">I've worked</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Timeline */}
          <div className="lg:col-span-2 relative">
            <span className="absolute left-5 top-2 bottom-2 w-px bg-gray-300" />

            <div className="space-y-8">
              {experience.map((exp, i) => (
                <motion.div
                  key={exp.company}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative pl-16"
                >
                  <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-white border-2 border-primary flex items-center justify-center shadow-md">
                    <HiOutlineBriefcase className="text-primary" />
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="text-navy font-bold font-display text-lg">
                          {exp.role}
                        </h3>
                        <div className="text-primary font-semibold text-sm">
                          {exp.company}
                          {exp.location && (
                            <span className="text-text-muted font-normal">
                              {" "}
                              · {exp.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-text-muted bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                        {exp.period}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1.5 text-sm text-text-muted leading-relaxed">
                      {exp.bullets.map((b, j) => (
                        <li key={j} className="flex gap-2">
                          <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-28">
              <h3 className="text-navy font-bold font-display text-lg mb-5 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-primary rounded-full" />
                Certifications
              </h3>
              <ul className="space-y-4">
                {certifications.map((c) => (
                  <li
                    key={c.name}
                    className="border-l-2 border-primary/30 hover:border-primary pl-4 transition-colors"
                  >
                    <div className="font-semibold text-navy text-sm">
                      {c.name}
                    </div>
                    <div className="text-xs text-text-muted">{c.issuer}</div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
