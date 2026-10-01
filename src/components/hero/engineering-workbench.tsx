import Image from "next/image";

const shots = [
  {
    src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1400&q=80",
    alt: "Laboratory robot on a workbench",
    className: "col-start-1 col-span-7 row-start-1 row-span-4",
  },
  {
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    alt: "Printed circuit board",
    className: "col-start-8 col-span-5 row-start-1 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=900&q=80",
    alt: "Embedded electronics and sensors",
    className: "col-start-8 col-span-5 row-start-3 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    alt: "Mechanical tools on a workbench",
    className: "col-start-1 col-span-4 row-start-5 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80",
    alt: "Engineer reviewing a mechanical prototype",
    className: "col-start-5 col-span-4 row-start-5 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    alt: "CAD review beside a prototype",
    className: "col-start-9 col-span-4 row-start-5 row-span-2",
  },
];

const tags = [
  { label: "3D CAD", className: "left-[6%] top-[8%]" },
  { label: "ROBOTICS", className: "right-[8%] top-[18%]" },
  { label: "ELECTRONICS", className: "right-[4%] top-[46%]" },
  { label: "PROTOTYPING", className: "left-[8%] bottom-[22%]" },
  { label: "MECHANICAL", className: "right-[12%] bottom-[10%]" },
];

export function EngineeringWorkbench() {
  return (
    <div className="bench-drift relative lg:-mr-10 xl:-mr-20">
      <div className="relative border border-black bg-white p-3">
        <div
          className="pointer-events-none absolute inset-3 opacity-15"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative grid h-[460px] grid-cols-12 grid-rows-6 gap-2 sm:h-[540px]">
          {shots.map((shot) => (
            <figure key={shot.alt} className={`relative overflow-hidden border border-black ${shot.className}`}>
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                priority={shot.className.includes("row-start-1") && shot.className.includes("col-start-1")}
                className="object-cover grayscale"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </figure>
          ))}
        </div>
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 600 640" aria-hidden>
          <g stroke="#000" strokeWidth="0.8" fill="none" opacity="0.85">
            <path className="measure-dash" d="M24 36 H160" />
            <path d="M24 30 V42 M160 30 V42" />
            <path className="measure-dash" d="M430 80 V220" />
            <path d="M424 80 H436 M424 220 H436" />
            <path className="measure-dash" d="M48 560 H220" />
            <circle cx="48" cy="560" r="2.5" fill="#000" stroke="none" />
            <circle cx="220" cy="560" r="2.5" fill="#000" stroke="none" />
          </g>
          <text x="28" y="28" fill="#000" fontSize="10" fontFamily="ui-monospace, monospace">
            X 012.4
          </text>
          <text x="444" y="150" fill="#000" fontSize="10" fontFamily="ui-monospace, monospace">
            Y 086.1
          </text>
          <text x="36" y="548" fill="#000" fontSize="11" fontFamily="ui-monospace, monospace" letterSpacing="1.5">
            DESIGN → PROTOTYPE → BUILD
          </text>
        </svg>
        {tags.map((tag) => (
          <span
            key={tag.label}
            className={`absolute border border-black bg-white px-2 py-1 font-mono text-[10px] tracking-[0.16em] text-black ${tag.className}`}
          >
            {tag.label}
          </span>
        ))}
      </div>
    </div>
  );
}
