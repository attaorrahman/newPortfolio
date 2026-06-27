import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import FloatingActions from "@/components/FloatingActions";
import ScrollProgress from "@/components/ScrollProgress";
import AboutHero from "@/components/about/AboutHero";
import AboutIntro from "@/components/about/AboutIntro";
import AboutSkills from "@/components/about/AboutSkills";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Services from "@/components/Services";
import AboutTestimonials from "@/components/about/AboutTestimonials";
import AboutClients from "@/components/about/AboutClients";

export const metadata = {
  title: "About — M. Atta Ur Rahman",
  description:
    "Full-Stack Developer based in Lahore. Background, education, complete tech stack, work experience and certifications of M. Atta Ur Rahman.",
};

export default function AboutPage() {
  return (
    <main className="relative overflow-hidden bg-white min-h-screen">
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <AboutHero />
      <AboutIntro />
      <AboutSkills />
      <Skills />
      <Services />
      <Experience />
      <AboutTestimonials />
      <AboutClients />
      <Footer />
      <FloatingActions />
    </main>
  );
}
