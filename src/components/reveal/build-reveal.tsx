"use client";

import TigerTearReveal from "@/components/ui/tiger-tear-reveal";

export function BuildReveal() {
  return (
    <section id="reveal" aria-label="From idea to hardware">
      <TigerTearReveal
        word="BUILD"
        tagline="FROM IDEA TO HARDWARE"
        ink="#0B1117"
        paper="#E8F4ED"
        taglineColor="#267047"
        eyeColor="#c8892e"
        furColor="#c4893f"
        height="100svh"
        scrollDistance="160svh"
      />
    </section>
  );
}
