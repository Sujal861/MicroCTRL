"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useOutsideClick } from "@/hooks/use-outside-click";

export interface BentoGridProps {
  items: {
    id: string | number;
    title: string;
    subtitle?: string;
    description?: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
  }[];
}

export default function ExpandableBentoGrid({ items }: BentoGridProps) {
  const [active, setActive] = useState<(typeof items)[number] | boolean | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(false);
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] h-full w-full bg-black/20"
          />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 top-16 z-[10001] grid place-items-center">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white lg:hidden"
              onClick={() => setActive(null)}
            >
              <X className="h-4 w-4 text-black" />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="flex h-full w-full max-w-[500px] flex-col overflow-hidden bg-white sm:rounded-3xl md:h-fit md:max-h-[90%] border border-black/10"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <div className="flex h-40 w-full items-center justify-center bg-neutral-100 md:h-52 lg:h-60">
                  {active.icon ? (
                    <div className="scale-[2] text-black">{active.icon}</div>
                  ) : (
                    <div className="h-full w-full bg-neutral-200" />
                  )}
                </div>
              </motion.div>

              <div>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-neutral-800 md:text-sm"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.title}-${id}`}
                      className="text-balance text-[14px] text-neutral-600"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href="#project-form"
                    onClick={() => setActive(null)}
                    className="rounded-2xl bg-black px-4 py-3 text-sm font-bold text-white"
                  >
                    Start
                  </motion.a>
                </div>

                <div className="mx-auto flex justify-center overflow-auto px-4 pt-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-40 flex-col items-start gap-4 pb-5 text-xs text-neutral-600 md:h-fit md:text-sm lg:text-base [scrollbar-width:none] [-ms-overflow-style:none]"
                  >
                    {active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="mx-auto grid w-full max-w-4xl grid-cols-1 items-start gap-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {items.map((item) => (
          <motion.div
            layoutId={`card-${item.title}-${id}`}
            key={item.id}
            onClick={() => setActive(item)}
            className="flex cursor-pointer flex-col items-center justify-between rounded-xl border border-black/10 bg-white p-4 transition-colors hover:bg-neutral-50 md:flex-row"
          >
            <div className="mx-auto flex flex-row items-center justify-center gap-3">
              <motion.div layoutId={`image-${item.title}-${id}`}>
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-neutral-100 p-1 text-black">
                  {item.icon}
                </div>
              </motion.div>
              <div>
                <motion.h3
                  layoutId={`title-${item.title}-${id}`}
                  className="text-left font-medium text-neutral-800"
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${item.title}-${id}`}
                  className="text-left text-xs text-neutral-600 md:text-[14px]"
                >
                  {item.subtitle}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  );
}
