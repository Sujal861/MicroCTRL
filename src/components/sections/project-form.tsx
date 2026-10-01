"use client";

import dynamic from "next/dynamic";

const LiquidMetalButton = dynamic(
  () => import("@/components/ui/liquid-metal-button").then((mod) => mod.LiquidMetalButton),
  { ssr: false },
);

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdAjmfMEbguOCX0iVYJ231J8v2wCvwgi0eGue9ilnr7hxXRWg/viewform";

const contacts = [
  { label: "Email", value: "ctrlmicro@gmail.com", href: "mailto:ctrlmicro@gmail.com" },
  { label: "Phone", value: "8951386816", href: "tel:+918951386816" },
  { label: "Telegram", value: "Message MicroCTRL", href: "https://t.me/+afflTTJYeBtlOWJl" },
];

export function ProjectForm() {
  return (
    <section id="project-form" className="border-t border-black/10 bg-white px-4 py-16 pb-28 sm:px-8 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-mono text-xs tracking-[0.22em] text-black">START A BUILD</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black sm:text-5xl">
            Tell MicroCTRL what you want to build.
          </h2>
          <p className="mt-4 text-black">
            Idea, budget, and requirements are enough to start. We reply with a plan for design
            and prototyping.
          </p>
          <ul className="mt-8 grid gap-3">
            {contacts.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  className="glass-chip flex items-center justify-between gap-3 px-4 py-3 text-sm text-black"
                >
                  <span className="font-mono text-[11px] tracking-[0.16em]">{item.label}</span>
                  <span className="min-w-0 truncate text-right font-medium">{item.value}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass-panel flex flex-col justify-between gap-8 p-6 sm:p-8">
          <div>
            <p className="font-mono text-xs tracking-[0.18em] text-black">PROJECT FORM</p>
            <p className="mt-4 text-2xl font-semibold text-black">Send the brief directly.</p>
            <p className="mt-3 text-black">
              The form collects your idea, budget, and requirements. Email, phone, and Telegram
              are there if you would rather talk it through.
            </p>
          </div>
          <LiquidMetalButton
            href={FORM_URL}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-fit"
            metalConfig={{ colorBack: "#111111", colorTint: "#ffffff", speed: 0.35 }}
          >
            Open project form →
          </LiquidMetalButton>
        </div>
      </div>
    </section>
  );
}
