import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import TechStack from '@/components/TechStack';
import Recognition from '@/components/Recognition';
import Hobbies from '@/components/Hobbies';
import ContactSection from '@/components/ContactSection';
import Divider from '@/components/Divider';
import Nav from '@/components/Nav';

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Divider />
      <About />
      <Divider />
      <Projects />
      <Divider />
      <TechStack />
      <Divider />
      <Recognition />
      <Divider />
      <Hobbies />
      <ContactSection />
    </main>
  );
}
