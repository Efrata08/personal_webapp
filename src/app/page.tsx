import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import TechStack from '@/components/TechStack';
import Recognition from '@/components/Recognition';
import Divider from '@/components/Divider';

export default function Home() {
  return (
    <main>
      <Hero />
      <Divider />
      <About />
      <Divider />
      <Projects />
      <Divider />
      <TechStack />
      <Divider />
      <Recognition />
    </main>
  );
}
