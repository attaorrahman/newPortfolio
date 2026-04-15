import Link from "next/link";
import { projects } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import FloatingActions from "@/components/FloatingActions";
import ProjectCard from "@/components/ProjectCard";
import { FiArrowLeft } from "react-icons/fi";

export const metadata = {
  title: "All Projects — M. Atta Ur Rahman",
  description:
    "Full list of projects built by M. Atta Ur Rahman — dashboards, marketplaces, ecommerce and full-stack apps.",
};

export default function ProjectsPage() {
  return (
    <main className="relative overflow-hidden bg-navy-dark min-h-screen">
      <CustomCursor />
      <Navbar />

      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="hero-glow -top-40 -left-40 opacity-50" />
        <div className="hero-glow bottom-0 right-0 opacity-40" />

        <div className="section-container relative z-10">
          <Link
            href="/#portfolio"
            className="inline-flex items-center gap-2 text-white/70 hover:text-primary transition-colors mb-6 text-sm"
          >
            <FiArrowLeft /> Back to home
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-primary font-semibold text-sm tracking-wider">
              Portfolio
            </span>
            <span className="text-lg">🎨</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white font-display leading-[1.05]">
            All <span className="text-primary">Projects</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-xl leading-relaxed">
            A full catalog of work — from client dashboards and full-stack
            platforms to personal showcases. Click any card for the live demo
            or open the repo on GitHub.
          </p>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActions />
    </main>
  );
}
