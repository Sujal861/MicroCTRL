"use client";

import dynamic from "next/dynamic";
import { AsciiGlitchRipple } from "@/components/ui/ascii-glitch-ripple";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";
import { PixelatedImageTrail } from "@/components/ui/pixelated-image-trail";

const LiquidMetalButton = dynamic(
  () => import("@/components/ui/liquid-metal-button").then((mod) => mod.LiquidMetalButton),
  { ssr: false },
);

const capabilities = [
  "ROBOTICS",
  "EMBEDDED SYSTEMS",
  "ELECTRONICS",
  "MECHANICAL DESIGN",
  "3D PRINTING",
];

const trailImages = [
  "/trail-images/image1.jpg",
  "/trail-images/image2.jpg",
  "/trail-images/image3.jpg",
  "/trail-images/image4.jpg",
  "/trail-images/image5.jpg",
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-svh overflow-hidden bg-white">
      <PerspectiveGrid className="absolute inset-0" gridSize={28} />
      <PixelatedImageTrail images={trailImages} className="z-[1]" imageSize={140} />
      <div className="pointer-events-none relative z-10 mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-4 pb-16 pt-28 sm:px-8">
        <div className="pointer-events-auto max-w-3xl">
          <p className="font-mono text-[10px] tracking-[0.18em] text-black sm:text-xs sm:tracking-[0.22em]">
            ENGINEERING • PROTOTYPING • 3D DESIGN
          </p>
          <h1 className="mt-5 text-[clamp(2.35rem,9vw,4.75rem)] font-semibold leading-[0.95] tracking-tight text-black">
            <AsciiGlitchRipple className="block">Have an Idea?</AsciiGlitchRipple>
            <AsciiGlitchRipple className="mt-2 block">Let’s Build It.</AsciiGlitchRipple>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-black sm:text-lg">
            From project ideas to working prototypes — tell us what you want to build, your
            budget, and your requirements. MicroCTRL helps you plan, design, prototype, and
            bring it to life.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <LiquidMetalButton
              className="w-full sm:w-auto"
              metalConfig={{ colorBack: "#111111", colorTint: "#ffffff", speed: 0.35 }}
              onClick={() => scrollTo("project-form")}
            >
              Start Your Project →
            </LiquidMetalButton>
            <LiquidMetalButton
              className="w-full sm:w-auto"
              metalConfig={{ colorBack: "#444444", colorTint: "#ffffff", speed: 0.3 }}
              onClick={() => scrollTo("how-it-works")}
            >
              How It Works
            </LiquidMetalButton>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] tracking-[0.14em] text-black sm:text-xs">
            {capabilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
