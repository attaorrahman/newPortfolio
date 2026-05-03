"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { profile } from "@/lib/data";

export default function AboutIntro() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="section-container grid lg:grid-cols-2 gap-14 items-center">
        {/* Portrait card */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="relative rounded-[32px] bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100 p-3 shadow-xl shadow-primary/5 max-w-md mx-auto">
            <div className="relative rounded-[24px] overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 aspect-[4/5]">
              {/* Decorative leaves */}
              <svg
                className="absolute top-6 left-6 w-10 h-10 text-white z-10"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C8 6 6 10 10 14c-2 1-4 3-4 6 3 0 5-2 6-4 4 4 8 2 12-2-4-4-8-6-12-12z" />
              </svg>
              <svg
                className="absolute top-10 right-8 w-8 h-8 text-white z-10"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C8 6 6 10 10 14c-2 1-4 3-4 6 3 0 5-2 6-4 4 4 8 2 12-2-4-4-8-6-12-12z" />
              </svg>

              <Image
                src="/AR Logo7.png"
                alt={profile.fullName}
                width={560}
                height={644}
                priority
                sizes="(max-width: 768px) 90vw, 460px"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[115%] w-auto max-w-none object-contain object-bottom drop-shadow-2xl"
              />
            </div>

            {/* Happy Clients badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-4 right-6 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                ☺
              </div>
              <div>
                <div className="text-navy font-bold text-lg leading-none">
                  30<span className="text-primary">+</span>
                </div>
                <div className="text-[10px] text-text-muted uppercase tracking-wider">
                  Happy Clients
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display leading-tight text-navy">
            I <span className="text-primary">build software</span> that solve user problems
          </h2>
          <p className="text-text-muted mt-5 leading-relaxed">
            I'm {profile.fullName} — an AI Powered Full Stack Developer with 3+ years of
            experience crafting responsive, high-performance web applications
            with React.js, Next.js and Node.js. I enjoy turning complex
            requirements into clean, scalable interfaces and well-architected
            REST APIs — pairing strong UI engineering with solid backend
            fundamentals. I take pride in writing maintainable code, mentoring
            teammates, and shipping features that genuinely move the needle for
            users and clients alike.
          </p>

          <div className="mt-8">
            <h3 className="text-2xl font-bold font-display text-navy mb-4">
              In summary
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-text-muted">Current Location</dt>
                <dd className="text-navy font-semibold mt-0.5">
                  Lahore, Pakistan
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Education</dt>
                <dd className="text-navy font-semibold mt-0.5">
                  BS Computer Science — The Islamia University Bahawalpur
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Interests</dt>
                <dd className="text-navy font-semibold mt-0.5">
                  Coding, Open Source, Cricket, Reading, Design Systems
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Email</dt>
                <dd className="mt-0.5">
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-primary font-semibold hover:underline"
                  >
                    {profile.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
