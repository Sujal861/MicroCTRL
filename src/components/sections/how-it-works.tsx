const steps = [
  {
    index: "01",
    title: "Tell us the idea",
    body: "Share what you want to build, who it is for, and the constraints that matter.",
  },
  {
    index: "02",
    title: "Plan and design",
    body: "MicroCTRL maps the electronics, mechanics, and 3D design into a build you can review.",
  },
  {
    index: "03",
    title: "Prototype it",
    body: "We fabricate, assemble, and test until the idea is a working prototype.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-[#29323A] bg-[#0B1117] px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs tracking-[0.22em] text-[#3FA66B]">PROCESS</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          How it works
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.index} className="border border-[#29323A] bg-[#121920] p-6">
              <p className="font-mono text-sm text-[#3FA66B]">{step.index}</p>
              <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#A7B0B8]">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
