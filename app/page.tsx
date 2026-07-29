import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Credentials from "@/components/Credentials";
import CaseStudies from "@/components/CaseStudies";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Credentials />
      <CaseStudies />
      <Footer />
    </main>
  );
}
