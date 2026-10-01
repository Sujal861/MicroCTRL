"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

export function ProjectForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <section id="project-form" className="border-t border-[#29323A] bg-[#0B1117] px-5 py-20 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-mono text-xs tracking-[0.22em] text-[#3FA66B]">START A BUILD</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Tell MicroCTRL what you want to build.
          </h2>
          <p className="mt-4 text-[#A7B0B8]">
            Idea, budget, and requirements are enough to start. We reply with a plan for design
            and prototyping.
          </p>
        </div>
        {sent ? (
          <div className="border border-[#29323A] bg-[#121920] p-8">
            <p className="font-mono text-xs tracking-[0.18em] text-[#3FA66B]">RECEIVED</p>
            <p className="mt-4 text-2xl font-semibold text-white">We have your project brief.</p>
            <p className="mt-3 text-[#A7B0B8]">
              This demo keeps the brief in the browser. A production form would send it to MicroCTRL.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-4 border border-[#29323A] bg-[#121920] p-6 sm:p-8">
            <label className="grid gap-2 text-sm text-[#A7B0B8]">
              Name
              <input
                required
                name="name"
                className="h-11 border border-[#29323A] bg-[#0B1117] px-3 text-white outline-none focus:border-[#3FA66B]"
              />
            </label>
            <label className="grid gap-2 text-sm text-[#A7B0B8]">
              What do you want to build?
              <textarea
                required
                name="idea"
                rows={4}
                className="border border-[#29323A] bg-[#0B1117] px-3 py-2 text-white outline-none focus:border-[#3FA66B]"
              />
            </label>
            <label className="grid gap-2 text-sm text-[#A7B0B8]">
              Budget
              <input
                required
                name="budget"
                placeholder="e.g. ₹50,000 – ₹2,00,000"
                className="h-11 border border-[#29323A] bg-[#0B1117] px-3 text-white outline-none focus:border-[#3FA66B]"
              />
            </label>
            <label className="grid gap-2 text-sm text-[#A7B0B8]">
              Requirements
              <textarea
                required
                name="requirements"
                rows={4}
                className="border border-[#29323A] bg-[#0B1117] px-3 py-2 text-white outline-none focus:border-[#3FA66B]"
              />
            </label>
            <Button type="submit" className="mt-2 w-full sm:w-fit">
              Send project brief
            </Button>
          </form>
        )}
      </div>
      <p className="mx-auto mt-16 max-w-6xl font-mono text-[11px] text-[#A7B0B8]">
        Soundtrack: “Local Forecast” by Kevin MacLeod (incompetech.com), CC BY 4.0.
      </p>
    </section>
  );
}
