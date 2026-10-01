"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "#hero" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Build", href: "#reveal" },
  { label: "Team", href: "#team" },
  { label: "Start", href: "#project-form" },
];

const spring = { type: "spring" as const, stiffness: 280, damping: 28, mass: 0.7 };

function NotchEdge({ side }: { side: "left" | "right" }) {
  const left = side === "left";
  return (
    <div className="relative h-16 w-[50px] shrink-0 self-start">
      <div
        className="glass-bar absolute inset-0"
        style={{
          clipPath: left
            ? "path('M0 0 H50 V64 C25 64 25 40 0 40 Z')"
            : "path('M0 0 H50 V40 C25 40 25 64 0 64 Z')",
        }}
      />
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 50 64">
        <path
          d={left ? "M0 39.5 C25 39.5 25 63.5 50 63.5" : "M0 63.5 C25 63.5 25 39.5 50 39.5"}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.35}
        />
      </svg>
    </div>
  );
}

export function NotchNavbar({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 flex items-start text-white", className)}>
      <div className="glass-bar relative z-20 h-10 min-w-0 flex-1">
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <line x1="0" y1="39.5" x2="100%" y2="39.5" stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} />
        </svg>
      </div>

      <motion.div layout transition={spring} className="relative z-10 -ml-px flex max-w-[calc(100vw-1rem)]">
        <NotchEdge side="left" />
        <motion.div
          layout
          transition={spring}
          className="relative -ml-px min-w-0 self-start overflow-hidden rounded-b-3xl"
        >
          <div className="glass-bar absolute inset-0" />
          <div className="relative flex flex-col items-stretch px-2 pb-3 pt-7 sm:px-3">
            <nav className="hidden items-center gap-2 lg:flex">
              {links.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, y: -14 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ ...spring, delay: 0.08 + index * 0.05 }}
                  className="glass-chip whitespace-nowrap px-3 py-1 text-sm font-medium text-black"
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>

            <button
              type="button"
              className="glass-chip mx-auto flex h-9 w-9 items-center justify-center text-black lg:hidden"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <motion.span
                className="flex"
                animate={{ rotate: open ? 90 : 0 }}
                transition={spring}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {open ? (
                <motion.nav
                  key="mobile-links"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  className="flex w-[min(16rem,72vw)] flex-col overflow-hidden lg:hidden"
                >
                  {links.map((item, index) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ ...spring, delay: 0.05 + index * 0.045 }}
                      onClick={() => setOpen(false)}
                      className="glass-chip mt-2 block px-4 py-3 text-sm font-medium text-black"
                    >
                      {item.label}
                    </motion.a>
                  ))}
                </motion.nav>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>
        <NotchEdge side="right" />
      </motion.div>

      <div className="glass-bar relative z-20 -ml-px h-10 min-w-0 flex-1">
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <line x1="0" y1="39.5" x2="100%" y2="39.5" stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} />
        </svg>
      </div>
    </header>
  );
}
