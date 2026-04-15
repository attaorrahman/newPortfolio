import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import FloatingActions from "@/components/FloatingActions";
import AboutHero from "@/components/about/AboutHero";
import AboutIntro from "@/components/about/AboutIntro";
import AboutSkills from "@/components/about/AboutSkills";
import AboutTestimonials from "@/components/about/AboutTestimonials";
import AboutClients from "@/components/about/AboutClients";

export const metadata = {
  title: "About — M. Atta Ur Rahman",
  description:
    "Full Stack Developer based in Lahore. Learn more about M. Atta Ur Rahman — background, education, skills and what I love doing.",
};

export default function AboutPage() {
  return (
    <main className="relative overflow-hidden bg-white min-h-screen">
      <CustomCursor />
      <Navbar />
      <AboutHero />
      <AboutIntro />
      <AboutSkills />
      <AboutTestimonials />
      <AboutClients />
      <Footer />
      <FloatingActions />
    </main>
  );
}
