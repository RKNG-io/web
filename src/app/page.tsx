import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import PersonaCards from '@/components/PersonaCards';
import HowItWorks from '@/components/HowItWorks';
import Benefits from '@/components/Benefits';
import BlockedUnlocked from '@/components/BlockedUnlocked';
import Packages from '@/components/Packages';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
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
        <Benefits />
        <BlockedUnlocked />
        <section id="packages">
          <Packages />
        </section>
        <Testimonials />
        <section id="faq">
          <FAQ />
        </section>
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
