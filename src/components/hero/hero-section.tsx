"use client";

import { Button } from "@/components/ui/button";
import ConstellationGrid from "@/components/ui/constellation-grid";
import { EngineeringWorkbench } from "@/components/hero/engineering-workbench";

const capabilities = [
  "ROBOTICS",
  "EMBEDDED SYSTEMS",
  "ELECTRONICS",
  "MECHANICAL DESIGN",
  "3D PRINTING",
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-svh overflow-hidden bg-[#0B1117]">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <ConstellationGrid />
      </div>
      <div className="relative mx-auto grid min-h-svh max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-8 lg:px-10 lg:py-20">
        <div className="max-w-xl">
          <p className="font-mono text-xs tracking-[0.22em] text-[#A7B0B8]">
            ENGINEERING <span className="text-[#3FA66B]">•</span> PROTOTYPING{" "}
            <span className="text-[#3FA66B]">•</span> 3D DESIGN
          </p>
          <h1 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Have an Idea?
            <br />
            Let’s Build It.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-[#A7B0B8] sm:text-lg">
            From project ideas to working prototypes — tell us what you want to build, your
            budget, and your requirements. MicroCTRL helps you plan, design, prototype, and
            bring it to life.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button className="w-full sm:w-auto" onClick={() => scrollTo("project-form")}>
              Start Your Project →
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => scrollTo("how-it-works")}
            >
              How It Works
            </Button>
          </div>
          <p className="mt-8 font-mono text-[11px] tracking-[0.14em] text-[#A7B0B8] sm:text-xs">
            {capabilities.join("  ·  ")}
          </p>
        </div>
        <EngineeringWorkbench />
      </div>
    </section>
  );
}
