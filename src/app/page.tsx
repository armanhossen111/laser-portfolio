import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import AboutContact from "@/components/AboutContact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-dark-slate selection:bg-safety-orange selection:text-white">
      <Hero />
      <Services />
      <Portfolio isHomePage={true} />
      <AboutContact />
      <Footer />
    </main>
  );
}
