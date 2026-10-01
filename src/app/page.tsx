import { ScrollSoundtrack } from "@/components/audio/scroll-soundtrack";
import { NotchNavbar } from "@/components/nav/notch-navbar";
import { HeroSection } from "@/components/hero/hero-section";
import { BuildReveal } from "@/components/reveal/build-reveal";
import { HowItWorks } from "@/components/sections/how-it-works";
import { MeetTheTeam } from "@/components/sections/meet-the-team";
import { ProjectForm } from "@/components/sections/project-form";

export default function Home() {
  return (
    <main>
      <NotchNavbar />
      <HeroSection />
      <BuildReveal />
      <HowItWorks />
      <MeetTheTeam />
      <ProjectForm />
      <ScrollSoundtrack />
    </main>
  );
}
