import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/landing/Hero';
import PersonaCards from '@/components/landing/PersonaCards';
import HowItWorks from '@/components/landing/HowItWorks';
import Benefits from '@/components/landing/Benefits';
import BlockedUnlocked from '@/components/landing/BlockedUnlocked';
import Packages from '@/components/landing/Packages';
import FAQ from '@/components/landing/FAQ';
import FinalCTA from '@/components/landing/FinalCTA';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <PersonaCards />
        <HowItWorks />
        <Benefits />
        <BlockedUnlocked />
        <Packages />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
