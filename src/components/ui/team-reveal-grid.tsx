"use client";

import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";

import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export interface TeamRevealMember {
  /** Stable identifier used by the controlled active state. */
  id: string;
  name: string;
  role: string;
  expertise: string;
  /** Shown in the portrait when no photo is set. Defaults to the name initials. */
  mark?: string;
  /** Any browser-readable image URL. When omitted, an initial-based portrait is rendered. */
  image?: string;
  imageAlt?: string;
  /** CSS object-position value used when an image is supplied. */
  imagePosition?: string;
  /** Accent shown while the member is active. */
  accent?: string;
  /** About text shown in the member popup. */
  bio?: string;
  /** Credential rows shown in the popup (education, experience, …). */
  facts?: { label: string; value: string }[];
  /** Skill tags shown in the popup. */
  skills?: string[];
  /** LinkedIn profile — the only external profile link surfaced. */
  linkedin?: string;
}

export interface TeamRevealGridProps
  extends Omit<React.ComponentPropsWithoutRef<"section">, "title"> {
  eyebrow?: string;
  title?: string;
  description?: string;
  members?: readonly TeamRevealMember[];
  /** Controlled active member id. */
  activeMemberId?: string | null;
  /** Initial active member id when uncontrolled. Defaults to the first member. */
  defaultActiveMemberId?: string | null;
  onActiveMemberChange?: (memberId: string | null) => void;
  /** Automatically moves the reveal between members when idle. */
  autoPlay?: boolean;
  rotationInterval?: number;
}

const DEFAULT_MEMBERS: readonly TeamRevealMember[] = [
  {
    id: "sujal-gupta",
    name: "Sujal Gupta B",
    role: "Software and robotics",
    expertise: "Software, robotics, and software.",
    image: "/team/sujal.jpg",
    imageAlt: "Portrait of Sujal Gupta B",
    imagePosition: "center 22%",
    accent: "#111111",
    bio: "Robotics and AI Engineering graduate with hands-on experience in ROS2, autonomous navigation, robot simulation, embedded systems, and mechanical design. Skilled at developing robotic and AI-driven solutions through academic, industrial, and automation projects — from CAD to working machines.",
    facts: [
      { label: "Education", value: "B.E. Robotics & Artificial Intelligence — Bangalore Technological Institute (CGPA 8.8)" },
      { label: "Experience", value: "Robotics Intern, Kodacy · AI & Automation Intern, Learners Byte" },
      { label: "Certifications", value: "NPTEL Advanced Robotics · Google Gemini & Vertex AI · MoE Innovation Ambassador" },
      { label: "Languages", value: "English · Kannada · Hindi · Telugu" },
    ],
    skills: ["ROS2", "Nav2 & SLAM", "Gazebo / Webots", "Fusion 360", "SolidWorks", "Arduino · ESP32 · Raspberry Pi"],
    linkedin: "https://www.linkedin.com/in/sujalgupta352/",
  },
  {
    id: "ganesh",
    name: "Ganesh B K",
    role: "Hardware, design, and robotics",
    expertise: "Hardware expertise, design, and robotics.",
    image: "/team/ganesh.png",
    imageAlt: "Portrait of Ganesh B K",
    imagePosition: "center 22%",
    accent: "#111111",
    bio: "Robotics and AI engineering student at Bangalore Technological Institute (VTU), focused on ROS2, SLAM, and simulation with Gazebo and RViz. Proficient in electrical wiring, PCB design, and 3D design — with an emphasis on their integration into robotics — and a collaborative mindset on team builds.",
    facts: [
      { label: "Education", value: "B.E. Robotics & Artificial Intelligence — Bangalore Technological Institute (VTU)" },
      { label: "Focus", value: "ROS2 · SLAM · Gazebo · RViz" },
      { label: "Hardware", value: "Electrical wiring · PCB design · 3D design" },
    ],
    skills: ["ROS2", "SLAM", "Gazebo", "RViz", "PCB design", "3D design"],
    linkedin: "https://www.linkedin.com/in/ganesh-b-k-b09b91315/",
  },
  {
    id: "shivakumara",
    name: "Shivakumara S",
    role: "Embedded systems, AI, and robotics",
    expertise: "Embedded systems, AI, and robotics.",
    image: "/team/shivakumara.png",
    imageAlt: "Portrait of Shivakumara S",
    imagePosition: "center 22%",
    accent: "#111111",
    bio: "Works across embedded systems, AI, and robotics — the combination MicroCTRL leans on when a project has to sense, decide, and act. His side of the build covers the embedded layer, intelligent software, and the robotic systems the team puts together.",
    facts: [
      { label: "Focus", value: "Embedded systems · AI · Robotics" },
      { label: "At MicroCTRL", value: "Embedded & intelligent systems across the team's builds" },
    ],
    skills: ["Embedded Systems", "AI", "Robotics"],
    linkedin: "https://www.linkedin.com/in/shivakumara-s-a8909b315/",
  },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function Portrait({ member, active }: { member: TeamRevealMember; active: boolean }) {
  const style = {
    "--team-accent": member.accent ?? "#111111",
  } as React.CSSProperties;

  return (
    <div
      style={style}
      className={cn(
        "relative h-full overflow-hidden rounded-[1.05rem] bg-neutral-100 transition-colors duration-500",
        active && "bg-[color-mix(in_srgb,var(--team-accent)_10%,white)]",
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 opacity-55 transition-opacity duration-500",
          active && "opacity-100",
        )}
        style={{
          background:
            "radial-gradient(circle at 68% 20%, color-mix(in srgb, var(--team-accent) 36%, transparent), transparent 36%), radial-gradient(circle at 22% 82%, color-mix(in srgb, var(--team-accent) 16%, transparent), transparent 42%)",
        }}
      />

      {member.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={member.image}
          alt={member.imageAlt ?? member.name}
          loading="lazy"
          draggable={false}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out motion-reduce:transition-none",
            active ? "scale-[1.02]" : "scale-100",
          )}
          style={{ objectPosition: member.imagePosition ?? "center top" }}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-end overflow-hidden">
          <div
            aria-hidden="true"
            className={cn(
              "absolute top-[13%] aspect-square h-[36%] rounded-full bg-neutral-300 transition-[transform,background-color] duration-500",
              active && "-translate-y-0.5 scale-105 bg-[var(--team-accent)]",
            )}
          />
          <div
            aria-hidden="true"
            className={cn(
              "absolute -bottom-[12%] h-[66%] w-[82%] rounded-t-[48%] bg-neutral-300/90 transition-[transform,background-color] duration-500",
              active && "scale-105 bg-[var(--team-accent)]",
            )}
          />
          <span className="relative z-10 mb-[18%] text-2xl font-semibold tracking-[-0.08em] text-white mix-blend-difference">
            {member.mark ?? initials(member.name)}
          </span>
        </div>
      )}

      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500",
          active ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}

export function TeamRevealGrid({
  eyebrow = "The people behind the build",
  title = "Meet the team",
  description = "Software, embedded systems, and hardware.",
  members = DEFAULT_MEMBERS,
  activeMemberId,
  defaultActiveMemberId,
  onActiveMemberChange,
  autoPlay = true,
  rotationInterval = 2800,
  className,
  ...props
}: TeamRevealGridProps) {
  const firstMemberId = members[0]?.id ?? null;
  const [internalActiveId, setInternalActiveId] = useState<string | null>(
    defaultActiveMemberId === undefined ? firstMemberId : defaultActiveMemberId,
  );
  const [interacting, setInteracting] = useState(false);
  /** Member whose "about" popup is open, if any. */
  const [popupId, setPopupId] = useState<string | null>(null);
  const isControlled = activeMemberId !== undefined;

  const popupMember = popupId ? members.find((m) => m.id === popupId) ?? null : null;

  const memberIds = useMemo(() => new Set(members.map((member) => member.id)), [members]);
  const requestedActiveId = isControlled ? activeMemberId : internalActiveId;
  const resolvedActiveId =
    requestedActiveId && memberIds.has(requestedActiveId) ? requestedActiveId : firstMemberId;

  const selectMember = useCallback(
    (memberId: string | null) => {
      if (!isControlled) setInternalActiveId(memberId);
      onActiveMemberChange?.(memberId);
    },
    [isControlled, onActiveMemberChange],
  );

  useEffect(() => {
    if (!autoPlay || interacting || popupId || members.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      const currentIndex = members.findIndex((member) => member.id === resolvedActiveId);
      const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % members.length;
      selectMember(members[nextIndex]?.id ?? null);
    }, Math.max(rotationInterval, 1200));

    return () => window.clearInterval(timer);
  }, [autoPlay, interacting, popupId, members, resolvedActiveId, rotationInterval, selectMember]);

  // Lock scroll and close on Escape while a member popup is open.
  useEffect(() => {
    if (!popupId) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPopupId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [popupId]);

  return (
    <section
      className={cn(
        "@container relative h-full min-h-[620px] w-full overflow-x-hidden overflow-y-auto bg-white px-4 py-10 text-neutral-950 sm:px-7 sm:py-12",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, currentColor 0.7px, transparent 0.8px)",
          backgroundSize: "12px 12px",
        }}
      />

      <div className="relative mx-auto w-full max-w-5xl">
        <header className="mx-auto mb-8 max-w-2xl text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
            {eyebrow}
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
            <span className="relative inline-block">
              <span className="relative z-10">{title}</span>
              <svg
                aria-hidden="true"
                className="absolute -bottom-3 left-0 h-3 w-full text-black sm:-bottom-4 sm:h-4"
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
                fill="none"
              >
                <path d="M2 12 Q35 2 95 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" pathLength="1">
                  <animate attributeName="stroke-dasharray" values="0 1;1 0" dur="700ms" fill="freeze" />
                </path>
                <path d="M5 15 Q40 18 98 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" pathLength="1">
                  <animate attributeName="stroke-dasharray" values="0 1;1 0" dur="800ms" begin="120ms" fill="freeze" />
                </path>
              </svg>
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-sm leading-6 text-neutral-600">
            {description}
          </p>
        </header>

        <ul className="grid grid-cols-2 gap-x-3 gap-y-6 @min-[560px]:grid-cols-3 @min-[560px]:gap-x-5 @min-[560px]:gap-y-5">
          {members.map((member) => {
            const active = member.id === resolvedActiveId;
            const detailsId = `team-member-${member.id}-details`;

            return (
              <li key={member.id} className="relative min-h-52 min-w-0 @min-[560px]:min-h-52">
                <button
                  type="button"
                  aria-expanded={active}
                  aria-controls={detailsId}
                  aria-haspopup="dialog"
                  onClick={() => {
                    selectMember(member.id);
                    setPopupId(member.id);
                  }}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") {
                      setInteracting(true);
                      selectMember(member.id);
                    }
                  }}
                  onPointerLeave={(event) => {
                    if (event.pointerType === "mouse") setInteracting(false);
                  }}
                  onFocus={() => {
                    setInteracting(true);
                    selectMember(member.id);
                  }}
                  onBlur={() => setInteracting(false)}
                  className="group block w-full rounded-[1.35rem] text-left outline-none"
                >
                  <div
                    style={{ "--team-accent": member.accent ?? "#111111" } as React.CSSProperties}
                    className={cn(
                      "relative overflow-hidden rounded-[1.35rem] border bg-white p-1.5 shadow-[0_10px_35px_-24px_rgba(0,0,0,0.42)] transition-[border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                      active
                        ? "-translate-y-1 border-[color-mix(in_srgb,var(--team-accent)_55%,transparent)] shadow-[0_22px_48px_-28px_color-mix(in_srgb,var(--team-accent)_55%,transparent)]"
                        : "border-black/10",
                      "focus-visible:ring-2 focus-visible:ring-[var(--team-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                    )}
                  >
                    <div
                      className={cn(
                        "h-28 transition-[height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none @min-[560px]:h-32",
                        active && "h-40 @min-[560px]:h-44",
                      )}
                    >
                      <Portrait member={member} active={active} />
                    </div>

                    <div
                      id={detailsId}
                      className={cn(
                        "absolute inset-x-5 bottom-4 z-10 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
                        active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                      )}
                    >
                      <p className="line-clamp-3 text-[11px] leading-[1.45] text-white/78 @min-[560px]:text-xs">
                        {member.expertise}
                      </p>
                    </div>
                  </div>

                  <div className="px-1.5 pt-3 text-center">
                    <h3 className="truncate text-sm font-semibold tracking-tight @min-[560px]:text-base">
                      {member.name}
                    </h3>
                    <p
                      className={cn(
                        "mt-0.5 truncate text-xs text-neutral-500 transition-colors duration-300",
                        active && "text-[var(--team-accent)]",
                      )}
                      style={{ "--team-accent": member.accent ?? "#111111" } as React.CSSProperties}
                    >
                      {member.role}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Member "about" popup */}
      <AnimatePresence>
        {popupMember ? (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <button
              type="button"
              aria-label="Close profile"
              onClick={() => setPopupId(null)}
              style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
              className="absolute inset-0 h-full w-full cursor-default"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`${popupMember.name} — profile`}
              initial={{ opacity: 0, y: 22, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.98 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="relative z-10 max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-black/10 bg-white p-6 shadow-2xl sm:p-8"
            >
              <button
                type="button"
                onClick={() => setPopupId(null)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-black/15 text-black/60 transition-colors hover:border-black/40 hover:text-black"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-4 pr-10">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-neutral-100">
                  {popupMember.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={popupMember.image}
                      alt={popupMember.imageAlt ?? popupMember.name}
                      draggable={false}
                      className="h-full w-full object-cover"
                      style={{ objectPosition: popupMember.imagePosition ?? "center top" }}
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-lg font-semibold text-black">
                      {initials(popupMember.name)}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-2xl font-semibold tracking-tight text-black sm:text-3xl">
                    {popupMember.name}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-black/50">
                    {popupMember.role}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-black/75 sm:text-base">
                {popupMember.bio ?? popupMember.expertise}
              </p>

              {popupMember.facts && popupMember.facts.length > 0 ? (
                <div className="mt-6 border-t border-black/10 pt-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45">
                    About
                  </p>
                  <dl className="mt-3 grid gap-3">
                    {popupMember.facts.map((row) => (
                      <div key={row.label} className="grid gap-1">
                        <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/40">
                          {row.label}
                        </dt>
                        <dd className="text-sm leading-relaxed text-black/80">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}

              {popupMember.skills && popupMember.skills.length > 0 ? (
                <div className="mt-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45">
                    Skills
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {popupMember.skills.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 text-[11px] font-medium leading-none text-black/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {popupMember.linkedin ? (
                <a
                  href={popupMember.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/80"
                >
                  <LinkedInIcon className="h-4 w-4" />
                  LinkedIn
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </a>
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

export default TeamRevealGrid;
