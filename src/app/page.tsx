import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import PersonaCards from '@/components/PersonaCards';
import HowItWorks from '@/components/HowItWorks';
import ReckoningCTA from '@/components/ReckoningCTA';
import ServiceExplorer from '@/components/ServiceExplorer';
import Testimonials from '@/components/Testimonials';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <PersonaCards />
        <section id="how-it-works">
          <HowItWorks />
        </section>
        <ReckoningCTA />
        <section id="services">
          <ServiceExplorer />
        </section>
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
