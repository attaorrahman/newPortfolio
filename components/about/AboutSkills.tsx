"use client";

import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { HiAcademicCap } from "react-icons/hi";

const education = [
  {
    school: "The Islamia University Bahawalpur",
    degree: "BS Computer Science (2019 - 2023)",
  },
  {
    school: "Govt. Sayad Nasr Ul Deen Shah Degree College",
    degree: "Intermediate — FSc Pre-Engineering (2017 - 2019)",
  },
  {
    school: "Secondary School — Lodhran",
    degree: "Matriculation — Science (2015 - 2017)",
  },
];

const softSkills = [
  { name: "Communication", level: 95 },
  { name: "Problem Solving", level: 92 },
  { name: "Web Application", level: 94 },
  { name: "Algorithm & Data Structure", level: 85 },
];

export default function AboutSkills() {
  return (
    <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display text-navy leading-tight">
            I'm great in what I do<br />
            and <span className="text-primary">I'm loving it</span>
          </h2>
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline self-start md:self-auto"
          >
            Hire Me <FiArrowUpRight />
          </a>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Education timeline */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold font-display text-navy mb-8">
              Education
            </h3>
            <ol className="relative border-l-2 border-dashed border-primary/30 ml-4 space-y-8">
              {education.map((e) => (
                <li key={e.school} className="pl-8 relative">
                  <span className="absolute -left-[18px] top-0 w-9 h-9 rounded-full bg-primary/10 border-2 border-white shadow-md flex items-center justify-center text-primary">
                    <HiAcademicCap />
                  </span>
                  <div className="text-xs text-text-muted">{e.school}</div>
                  <div className="text-navy font-semibold mt-0.5">
                    {e.degree}
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>

          {/* Skills bars */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold font-display text-navy mb-8">
              Skills
            </h3>
            <div className="space-y-5">
              {softSkills.map((s, i) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="text-navy font-semibold">{s.name}</span>
                    <span className="text-text-muted text-xs">{s.level}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.1 + i * 0.1 }}
                      className="h-full bg-gradient-to-r from-fuchsia-600 via-primary to-purple-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
