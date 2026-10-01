"use client";

import { Cpu, PenLine, MessageSquare } from "lucide-react";
import ExpandableBentoGrid from "@/components/ui/expandable-bento-grid";

const steps = [
  {
    id: "idea",
    title: "Tell us the idea",
    subtitle: "Step 01",
    description: "Share what you want to build.",
    icon: <MessageSquare className="h-7 w-7" />,
    content: (
      <p>
        Share what you want to build, who it is for, and the constraints that matter. Idea, budget,
        and requirements are enough to start.
      </p>
    ),
  },
  {
    id: "plan",
    title: "Plan and design",
    subtitle: "Step 02",
    description: "Electronics, mechanics, and 3D design.",
    icon: <PenLine className="h-7 w-7" />,
    content: (
      <p>MicroCTRL maps the electronics, mechanics, and 3D design into a build you can review.</p>
    ),
  },
  {
    id: "prototype",
    title: "Prototype it",
    subtitle: "Step 03",
    description: "A working prototype.",
    icon: <Cpu className="h-7 w-7" />,
    content: <p>We fabricate, assemble, and test until the idea is a working prototype.</p>,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-black/10 bg-white px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="font-mono text-xs tracking-[0.22em] text-black">PROCESS</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black sm:text-5xl">How it works</h2>
        <p className="mt-4 text-black">From the idea, through design, to a working prototype.</p>
      </div>
      <ExpandableBentoGrid items={steps} />
    </section>
  );
}
