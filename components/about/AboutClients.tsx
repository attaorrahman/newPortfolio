"use client";

import { motion } from "framer-motion";

const clients = [
  {
    name: "Aleedz",
    label: "Aleedz",
    gradient: "from-indigo-600 to-blue-700",
    icon: "A",
  },
  {
    name: "Ahmasoft",
    label: "Ahmasoft",
    gradient: "from-orange-500 to-red-500",
    icon: "◆",
  },
  {
    name: "Voyage Freight",
    label: "Voyage",
    gradient: "from-emerald-500 to-teal-600",
    icon: "✈",
  },
  {
    name: "Shop Next",
    label: "Shop Next",
    gradient: "from-fuchsia-500 to-pink-500",
    icon: "🛒",
  },
  {
    name: "Tour Time",
    label: "Tour Time",
    gradient: "from-amber-400 to-orange-500",
    icon: "🌐",
  },
];

export default function AboutClients() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-primary font-semibold text-sm tracking-wider">
              Happy Clients
            </span>
            <span className="text-lg">🎯</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-display text-navy">
            I work with over{" "}
            <span className="text-navy">150+</span>
            <br />
            <span className="text-primary">happy clients</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {clients.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group"
            >
              <div
                className={`rounded-2xl bg-gradient-to-br ${c.gradient} aspect-[4/3] flex items-center justify-center text-white shadow-lg shadow-primary/10 group-hover:shadow-primary/30 transition-shadow`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-1">{c.icon}</div>
                  <div className="font-bold text-lg font-display">
                    {c.label}
                  </div>
                </div>
              </div>
              <div className="text-center mt-3 text-text-muted text-sm font-medium">
                {c.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
