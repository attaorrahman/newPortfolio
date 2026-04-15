import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import FloatingActions from "@/components/FloatingActions";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
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
