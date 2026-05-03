import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";

// Heavy below-fold sections — load on demand to keep first-paint JS small.
const Skills = dynamic(() => import("@/components/Skills"));
const Services = dynamic(() => import("@/components/Services"));
const Experience = dynamic(() => import("@/components/Experience"));
const Portfolio = dynamic(() => import("@/components/Portfolio"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const Blog = dynamic(() => import("@/components/Blog"));
const Contact = dynamic(() => import("@/components/Contact"));
const FloatingActions = dynamic(() => import("@/components/FloatingActions"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Services />
      <Experience />
      <Portfolio />
      <Testimonials />
      <Blog />
      <Contact />
      <Footer />
      <FloatingActions />
    </main>
  );
}
