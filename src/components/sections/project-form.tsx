"use client";

import { FormEvent, useState } from "react";
import dynamic from "next/dynamic";

const LiquidMetalButton = dynamic(
  () => import("@/components/ui/liquid-metal-button").then((mod) => mod.LiquidMetalButton),
  { ssr: false },
);

const INBOX = "ctrlmicro@gmail.com";

const contacts = [
  { label: "Email", value: INBOX, href: `mailto:${INBOX}` },
  { label: "Phone", value: "8951386816", href: "tel:+918951386816" },
  { label: "Telegram", value: "Message MicroCTRL", href: "https://t.me/+afflTTJYeBtlOWJl" },
];

const fieldClass =
  "w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-black outline-none focus:border-black";

export function ProjectForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${INBOX}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...data,
          _subject: "MicroCTRL project brief",
          _template: "table",
        }),
      });
      if (!response.ok) throw new Error("send failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="project-form" className="border-t border-black/10 bg-white px-4 py-16 pb-28 sm:px-8 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-mono text-xs tracking-[0.22em] text-black">START A BUILD</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black sm:text-5xl">
            Tell MicroCTRL what you want to build.
          </h2>
          <p className="mt-4 text-black">
            Type the brief here. It is emailed to {INBOX}. We reply with a plan for design and
            prototyping.
          </p>
          <div className="mt-8">
            <p className="font-mono text-xs tracking-[0.18em] text-black">WHERE WE WORK</p>
            <p className="mt-3 text-black">
              Send the brief from anywhere. We design, fabricate, and test the prototype, then get
              it to you.
            </p>
          </div>
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
        <div className="glass-panel p-6 sm:p-8">
          {status === "sent" ? (
            <div>
              <p className="font-mono text-xs tracking-[0.18em] text-black">SENT</p>
              <p className="mt-4 text-2xl font-semibold text-black">We have your brief.</p>
              <p className="mt-3 text-black">It was sent to {INBOX}.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4">
              <p className="font-mono text-xs tracking-[0.18em] text-black">PROJECT BRIEF</p>
              <label className="grid gap-2 text-sm text-black">
                Name
                <input required name="name" autoComplete="name" className={fieldClass} />
              </label>
              <label className="grid gap-2 text-sm text-black">
                Your email
                <input required type="email" name="email" autoComplete="email" className={fieldClass} />
              </label>
              <label className="grid gap-2 text-sm text-black">
                Your number
                <input required type="tel" name="phone" autoComplete="tel" placeholder="Your phone number" className={fieldClass} />
              </label>
              <label className="grid gap-2 text-sm text-black">
                The idea
                <textarea required name="idea" rows={4} className={fieldClass} />
              </label>
              <label className="grid gap-2 text-sm text-black">
                Who it is for
                <input required name="who" className={fieldClass} />
              </label>
              <label className="grid gap-2 text-sm text-black">
                Budget
                <input required name="budget" placeholder="e.g. ₹50,000 – ₹2,00,000" className={fieldClass} />
              </label>
              <label className="grid gap-2 text-sm text-black">
                Size
                <input required name="size" placeholder="e.g. handheld, desktop, room-scale" className={fieldClass} />
              </label>
              <label className="grid gap-2 text-sm text-black">
                Deadline
                <input required name="deadline" className={fieldClass} />
              </label>
              <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />
              {status === "error" ? (
                <p className="text-sm text-black">The brief did not send. Email {INBOX} directly.</p>
              ) : null}
              <LiquidMetalButton
                type="submit"
                disabled={status === "sending"}
                className="mt-2 w-full sm:w-fit"
                metalConfig={{ colorBack: "#111111", colorTint: "#ffffff", speed: 0.35 }}
              >
                {status === "sending" ? "Sending…" : "Send brief →"}
              </LiquidMetalButton>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
