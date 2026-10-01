"use client";

import * as React from "react";

export interface TigerTearRevealProps {
  word?: string;
  tagline?: string;
  ink?: string;
  paper?: string;
  taglineColor?: string;
  eyeColor?: string;
  furColor?: string;
  fontFamily?: string;
  height?: string;
  scrollDistance?: string;
  progress?: number;
  hint?: boolean;
  className?: string;
}

export type Pt = [number, number];

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp01 = (x: number) => (x <= 0 ? 0 : x > 1 ? 1 : x);

export function smooth(a: number, b: number, x: number) {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

export function easeOutBack(t: number) {
  const c = 1.70158;
  const u = clamp01(t) - 1;
  return 1 + (c + 1) * u * u * u + c * u * u;
}

export function scrollProgress(top: number, height: number, viewport: number) {
  const range = height - viewport;
  if (range <= 0) return top <= 0 ? 1 : 0;
  return clamp01(-top / range);
}

export function stages(p: number) {
  return {
    crack: smooth(0.03, 0.2, p),
    open: smooth(0.18, 0.62, p),
    rise: smooth(0.26, 0.74, p),
    pop: smooth(0.58, 0.88, p),
    shake: smooth(0.16, 0.22, p) * (1 - smooth(0.26, 0.36, p)),
  };
}

export function tearLine(
  seed = 11,
  from = -800,
  to = 1800,
  step = 9,
  cx = 500,
  cy = 318,
  angle = -7,
): Pt[] {
  const r = rng(seed);
  const slope = Math.tan((angle * Math.PI) / 180);
  const out: Pt[] = [];
  for (let x = from; x <= to; x += step) {
    const fibre = (r() - 0.5) * 5;
    const tooth = r() < 0.09 ? (r() - 0.5) * 26 : 0;
    const wander = Math.sin(x * 0.019 + seed) * 10 + Math.sin(x * 0.053 + seed * 2) * 4;
    out.push([x, cy + (x - cx) * slope + wander + fibre + tooth]);
  }
  return out;
}

export function pieceMotion(open: number) {
  return {
    top: { dx: -10 * open, dy: -82 * open, rot: -2.6 * open },
    bottom: { dx: 12 * open, dy: 78 * open, rot: 2.1 * open },
  };
}

export function fibreWidths(n: number, open: number, seed = 5) {
  const r = rng(seed);
  const k = Math.min(1, open * 4);
  return Array.from(
    { length: n },
    (_, i) => k * (2.5 + 6 * (0.5 + 0.5 * Math.sin(i * 0.37 + seed)) * (0.6 + r() * 0.8)),
  );
}

const CX = 500;
const CY = 318;
const FAR = 4000;
const FRAME = "36 44 928 468";
const EYES: Pt[] = [
  [-138, 6],
  [138, -4],
];

const d = (pts: Pt[], close = true) =>
  "M" + pts.map(([x, y]) => x.toFixed(1) + " " + y.toFixed(1)).join("L") + (close ? "Z" : "");

function stripe(p0: Pt, p1: Pt, p2: Pt, w: number, n = 18) {
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const m = 1 - t;
    const x = m * m * p0[0] + 2 * m * t * p1[0] + t * t * p2[0];
    const y = m * m * p0[1] + 2 * m * t * p1[1] + t * t * p2[1];
    const dx = 2 * m * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
    const dy = 2 * m * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
    const l = Math.hypot(dx, dy) || 1;
    const h = (w / 2) * Math.pow(Math.sin(Math.PI * t), 0.6);
    left.push([x - (dy / l) * h, y + (dx / l) * h]);
    right.push([x + (dy / l) * h, y - (dx / l) * h]);
  }
  return d(left.concat(right.reverse()));
}

function buildStripes() {
  const r = rng(29);
  const j = (a: number) => (r() - 0.5) * a;
  const out: string[] = [];
  for (const k of [-2, -1, 0, 1, 2]) {
    out.push(
      stripe(
        [k * 27 + j(8), -205],
        [k * 21 + j(6), -140],
        [k * 11, -72 + Math.abs(k) * 10],
        13 - Math.abs(k) * 2,
      ),
    );
  }
  for (const s of [-1, 1]) {
    out.push(stripe([s * 50, -108], [s * 138, -140 + j(8)], [s * 228, -96], 13));
    out.push(stripe([s * 72, -158], [s * 150, -188 + j(8)], [s * 250, -150], 11));
    for (const y of [-160, -104, -48, 14, 76, 138]) {
      out.push(
        stripe(
          [s * 350, y + j(10)],
          [s * 292, y + j(26)],
          [s * (222 + r() * 30), y + j(34)],
          18 + r() * 8,
        ),
      );
    }
    out.push(stripe([s * 212, 38], [s * 256, 72], [s * 330, 98], 14));
    out.push(stripe([s * 182, 74], [s * 226, 120], [s * 312, 156], 12));
    out.push(stripe([s * 64, 22], [s * 50, 88], [s * 42, 178], 8));
    for (let k = 0; k < 16; k++) {
      const x = s * (390 + k * 70 + j(30));
      out.push(
        stripe(
          [x + j(40), -330],
          [x + s * 30 + j(40), j(60)],
          [x + s * 10 + j(40), 330],
          20 + r() * 14,
        ),
      );
    }
  }
  return out.join("");
}

function buildHairs() {
  const r = rng(53);
  const tones = ["", "", ""];
  for (let i = 0; i < 900; i++) {
    const x = (r() - 0.5) * 1400;
    const y = (r() - 0.5) * 480;
    const a = Math.atan2(y - 150, x) + (r() - 0.5) * 0.5;
    const l = 9 + r() * 12;
    const seg =
      "M" +
      x.toFixed(1) +
      " " +
      y.toFixed(1) +
      "l" +
      (Math.cos(a) * l).toFixed(1) +
      " " +
      (Math.sin(a) * l).toFixed(1);
    tones[r() < 0.45 ? 0 : r() < 0.7 ? 1 : 2] += seg;
  }
  return tones;
}

function buildFibres() {
  const r = rng(71);
  let s = "";
  for (let i = 0; i < 56; i++) {
    const a = (i / 56) * Math.PI * 2 + r() * 0.08;
    const r0 = 12 + r() * 4;
    const r1 = 30 + r() * 5;
    s +=
      "M" +
      (Math.cos(a) * r0).toFixed(1) +
      " " +
      (Math.sin(a) * r0).toFixed(1) +
      "L" +
      (Math.cos(a) * r1).toFixed(1) +
      " " +
      (Math.sin(a) * r1).toFixed(1);
  }
  return s;
}

const ALMOND = "M-78 10 C-52 -40 30 -56 80 -8 C44 40 -30 50 -78 10Z";

const Fur = React.memo(function Fur({ id, fur }: { id: string; fur: string }) {
  const stripes = React.useMemo(() => buildStripes(), []);
  const hairs = React.useMemo(() => buildHairs(), []);
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-fur`} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#e7b06a" />
          <stop offset="55%" stopColor={fur} />
          <stop offset="100%" stopColor="#8a4e1e" />
        </radialGradient>
        <clipPath id={`${id}-face`}>
          <ellipse cx="0" cy="10" rx="310" ry="250" />
        </clipPath>
      </defs>
      <ellipse cx="0" cy="24" rx="360" ry="280" fill={`url(#${id}-fur)`} />
      <g clipPath={`url(#${id}-face)`}>
        <path d={stripes} fill="#1a120c" />
        <path d={hairs[0]} fill="none" stroke="#2a1a10" strokeWidth="0.7" opacity="0.45" />
        <path d={hairs[1]} fill="none" stroke="#4a301c" strokeWidth="0.6" opacity="0.35" />
        <path d={hairs[2]} fill="none" stroke="#f0d2a4" strokeWidth="0.5" opacity="0.25" />
      </g>
      <ellipse cx="0" cy="78" rx="78" ry="58" fill="#f4e7d4" />
      <ellipse cx="0" cy="118" rx="22" ry="14" fill="#2b1c14" />
      {EYES.map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="86" ry="48" fill="#1a120c" />
      ))}
    </g>
  );
});

function Eye({
  id,
  x,
  y,
  flip,
  look,
  blink,
  pupil,
  scale,
  fibres,
  eyeColor,
}: {
  id: string;
  x: number;
  y: number;
  flip: boolean;
  look: Pt;
  blink: number;
  pupil: number;
  scale: number;
  fibres: string;
  eyeColor: string;
}) {
  const clip = id + (flip ? "-cl" : "-cr");
  const lx = look[0] * (flip ? -1 : 1);
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <defs>
        <clipPath id={clip}>
          <path d={ALMOND} />
        </clipPath>
      </defs>
      <path d={ALMOND} fill="#1c140e" />
      <g clipPath={`url(#${clip})`}>
        <ellipse cx="0" cy="2" rx="62" ry="34" fill="#f7f1e8" />
        <g transform={`translate(${(lx * 16).toFixed(2)} ${(look[1] * 8).toFixed(2)})`}>
          <circle r="26" fill={eyeColor} />
          <path d={fibres} fill="none" stroke="#5a3a12" strokeWidth="0.6" opacity="0.55" />
          <circle r={9 * pupil} fill="#0B1117" />
          <circle cx="-5" cy="-5" r="3" fill="#ffffff" />
        </g>
        <rect x="-90" y={-70 + blink * 78} width="180" height="90" fill="#c4893f" />
      </g>
    </g>
  );
}

const CURLS: Record<"top" | "bottom", [number, number, number][]> = {
  top: [
    [300, 44, 30],
    [575, 30, 20],
    [790, 52, 34],
  ],
  bottom: [
    [205, 50, 32],
    [470, 34, 22],
    [690, 40, 28],
  ],
};

function Half({
  id,
  side,
  line,
  open,
  paper,
  children,
}: {
  id: string;
  side: "top" | "bottom";
  line: Pt[];
  open: number;
  paper: string;
  children: React.ReactNode;
}) {
  const up = side === "top";
  const m = pieceMotion(open)[side];
  const shape = up
    ? ([[line[0][0], -FAR] as Pt, [line[line.length - 1][0], -FAR] as Pt, ...[...line].reverse()] as Pt[])
    : ([...line, [line[line.length - 1][0], FAR] as Pt, [line[0][0], FAR] as Pt] as Pt[]);
  const widths = fibreWidths(line.length, open, up ? 5 : 8);
  const core = line.concat(
    line.map(([x, y], i) => [x, y + (up ? -widths[i] : widths[i])] as Pt).reverse(),
  );
  const curls = CURLS[side].map(([cx, hw, depth]) => {
    const pts = line.filter(([x]) => Math.abs(x - cx) <= hw);
    if (pts.length < 2) return "";
    const back = pts.map(([x, y]) => {
      const s = Math.cos(((x - cx) / hw) * (Math.PI / 2));
      return [
        x + (up ? 6 : -6) * s * open,
        y + (up ? 1 : -1) * depth * s * s * Math.min(1, open * 2.5),
      ] as Pt;
    });
    return d(pts.concat(back.reverse()));
  });
  const transform = `translate(${m.dx.toFixed(2)} ${m.dy.toFixed(2)}) rotate(${m.rot.toFixed(3)} ${CX} ${CY})`;
  const clip = `${id}-${side}`;
  return (
    <g>
      {open > 0 ? (
        <path d={d(shape)} fill="#000" opacity={0.18 * open} transform={`${transform} translate(0 ${up ? 18 : -10})`} />
      ) : null}
      <defs>
        <clipPath id={clip}>
          <path d={d(shape)} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`} transform={transform}>
        <rect x={-FAR} y={-FAR} width={FAR * 2} height={FAR * 2} fill={paper} />
        {children}
      </g>
      {open > 0 ? (
        <g transform={transform}>
          <path d={d(core)} fill="#ffffff" />
          {curls.map((c, i) =>
            c ? <path key={i} d={c} fill={paper} stroke="#d5ddd8" strokeWidth="0.4" /> : null,
          )}
        </g>
      ) : null}
    </g>
  );
}

function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

type FrameState = { p: number; look: Pt; blink: number; squint: number };

export default function TigerTearReveal({
  word = "BUILD",
  tagline = "FROM IDEA TO HARDWARE",
  ink = "#0B1117",
  paper = "#E8F4ED",
  taglineColor = "#267047",
  eyeColor = "#c8892e",
  furColor = "#c4893f",
  fontFamily = 'var(--font-geist-sans), Impact, "Arial Black", sans-serif',
  height = "100svh",
  scrollDistance = "160svh",
  progress,
  hint = true,
  className = "",
}: TigerTearRevealProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const id = "ttr" + React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const fibres = React.useMemo(() => buildFibres(), []);
  const line = React.useMemo(() => tearLine(), []);
  const [f, setF] = React.useState<FrameState>({
    p: progress ?? 0,
    look: [0, 0],
    blink: 0,
    squint: 0,
  });

  const cfg = React.useRef({ progress, controlled: progress !== undefined, reduced });
  cfg.current = { progress, controlled: progress !== undefined, reduced };
  const pointer = React.useRef<{ x: number; y: number } | null>(null);
  const squintAt = React.useRef(-1e9);

  React.useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    let raf = 0;
    let visible = true;
    let p = cfg.current.progress ?? 0;
    let look: Pt = [0, 0];
    let idle: Pt = [0, 0];
    let nextIdle = 0;
    let nextBlink = performance.now() + 2500;
    let last: FrameState | null = null;

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(root);

    function tick(now: number) {
      raf = 0;
      if (!visible) return;
      const c = cfg.current;
      const target = c.controlled
        ? clamp01(c.progress ?? 0)
        : scrollProgress(root!.getBoundingClientRect().top, root!.offsetHeight, stage!.offsetHeight);
      p = c.reduced ? (target > 0.3 ? 1 : 0) : p + (target - p) * 0.14;
      if (Math.abs(target - p) < 0.0005) p = target;

      let want: Pt;
      if (pointer.current) {
        const r = stage!.getBoundingClientRect();
        want = [
          Math.max(-1, Math.min(1, (pointer.current.x - r.left - r.width / 2) / (r.width * 0.35))),
          Math.max(-1, Math.min(1, (pointer.current.y - r.top - r.height * 0.58) / (r.height * 0.35))),
        ];
      } else {
        if (now > nextIdle && !c.reduced) {
          const g = rng(Math.floor(now));
          idle = [(g() - 0.5) * 1.4, (g() - 0.5) * 0.8];
          nextIdle = now + 1400 + g() * 1800;
        }
        want = c.reduced ? [0, 0] : idle;
      }
      look = [look[0] + (want[0] - look[0]) * 0.14, look[1] + (want[1] - look[1]) * 0.14];

      let blink = 0;
      if (!c.reduced) {
        const since = now - nextBlink;
        if (since > 0) blink = since < 90 ? since / 90 : since < 200 ? 1 - (since - 90) / 110 : 0;
        if (since > 200) nextBlink = now + 2600 + Math.random() * 3200;
      }
      const squint = c.reduced ? 0 : Math.max(0, 1 - (now - squintAt.current) / 900);
      const next: FrameState = { p, look, blink, squint };
      if (
        !last ||
        Math.abs(next.p - last.p) > 1e-4 ||
        Math.abs(next.look[0] - last.look[0]) > 1e-3 ||
        Math.abs(next.look[1] - last.look[1]) > 1e-3 ||
        next.blink !== last.blink ||
        next.squint !== last.squint
      ) {
        last = next;
        setF(next);
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const s = stages(f.p);
  const pop = reduced ? s.pop : easeOutBack(s.pop);
  const eyeScale = 0.9 + 0.1 * pop;
  const pupil = 1.3 - 0.5 * s.pop + 0.35 * f.squint;
  const blink = Math.max(1 - clamp01(pop), f.blink, f.squint * 0.45);
  const rise = (1 - s.rise) * 150;
  const shake = reduced ? 0 : Math.sin(f.p * 900) * 6 * s.shake;
  const crackReach = s.crack * 620;
  const crack = line.filter(([x]) => Math.abs(x - CX) <= crackReach);
  const tiger =
    "translate(" +
    CX +
    " " +
    (CY + rise).toFixed(2) +
    ") rotate(-7) scale(" +
    (1.05 - 0.04 * s.rise).toFixed(4) +
    ")";

  const sheet = (
    <>
      {tagline ? (
        <text
          x={CX}
          y={CY - 118}
          textAnchor="middle"
          fill={taglineColor}
          fontSize="18"
          letterSpacing="6"
          fontFamily="ui-monospace, SFMono-Regular, Consolas, monospace"
        >
          {tagline}
        </text>
      ) : null}
      <text
        x={CX}
        y={CY + 48}
        textAnchor="middle"
        fill={ink}
        fontSize="148"
        fontWeight="800"
        fontFamily={fontFamily}
      >
        {word}
      </text>
    </>
  );

  return (
    <div ref={rootRef} className={className} style={{ height: `calc(${height} + ${scrollDistance})` }}>
      <div
        ref={stageRef}
        className="sticky top-0 overflow-hidden bg-[#0B1117]"
        style={{ height, cursor: s.pop > 0.9 ? "crosshair" : undefined }}
        onPointerMove={(e) => {
          pointer.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerLeave={() => {
          pointer.current = null;
        }}
        onPointerDown={() => {
          if (s.pop > 0.5) squintAt.current = performance.now();
        }}
      >
        <svg viewBox={FRAME} className="h-full w-full" role="img" aria-label={`${word} tear reveal`}>
          <g transform={`translate(${shake.toFixed(2)} 0)`}>
            {s.open > 0 ? (
              <g transform={tiger}>
                <Fur id={id} fur={furColor} />
                {EYES.map(([x, y], i) => (
                  <Eye
                    key={i}
                    id={id}
                    x={x}
                    y={y}
                    flip={i === 0}
                    look={f.look}
                    blink={blink}
                    pupil={pupil}
                    scale={eyeScale}
                    fibres={fibres}
                    eyeColor={eyeColor}
                  />
                ))}
              </g>
            ) : null}
            {s.open > 0 ? (
              <>
                <Half id={id} side="top" line={line} open={s.open} paper={paper}>
                  {sheet}
                </Half>
                <Half id={id} side="bottom" line={line} open={s.open} paper={paper}>
                  {sheet}
                </Half>
              </>
            ) : (
              <>
                <rect x="-800" y="-800" width="2600" height="2600" fill={paper} />
                {sheet}
              </>
            )}
            {s.crack > 0 && s.open < 0.15 && crack.length > 1 ? (
              <polyline
                points={crack.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}
                fill="none"
                stroke={ink}
                strokeWidth="1.4"
              />
            ) : null}
          </g>
        </svg>
        {hint && progress === undefined ? (
          <p className="pointer-events-none absolute bottom-6 left-0 right-0 text-center font-mono text-[11px] uppercase tracking-[0.28em] text-[#267047]">
            scroll
          </p>
        ) : null}
      </div>
    </div>
  );
}
