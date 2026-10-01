import { HeroSection } from "@/components/hero/hero-section";
import { BuildReveal } from "@/components/reveal/build-reveal";
import { HowItWorks } from "@/components/sections/how-it-works";
import { ProjectForm } from "@/components/sections/project-form";
import { ScrollSoundtrack } from "@/components/audio/scroll-soundtrack";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <BuildReveal />
      <HowItWorks />
      <ProjectForm />
      <ScrollSoundtrack />
    </main>
  );
}
