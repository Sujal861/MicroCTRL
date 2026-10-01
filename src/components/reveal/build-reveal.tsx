"use client";

import TigerTearReveal from "@/components/ui/tiger-tear-reveal";

export function BuildReveal() {
  return (
    <section id="reveal" aria-label="From idea to hardware">
      <TigerTearReveal
        word="BUILD"
        tagline="FROM IDEA TO HARDWARE"
        ink="#000000"
        paper="#FFFFFF"
        taglineColor="#000000"
        eyeColor="#f0a526"
        furColor="#d9832c"
        height="100svh"
        scrollDistance="160svh"
      />
    </section>
  );
}
