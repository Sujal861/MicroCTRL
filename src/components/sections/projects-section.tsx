"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CoverflowCarousel,
  type CoverflowSlide,
} from "@/components/ui/coverflow-carousel";
import {
  categories,
  projects,
  type Category,
  type CategoryId,
  type Project,
} from "@/data/projects";

const ACCENT = "#e8873a";
const EASE = [0.16, 1, 0.3, 1] as const;

const filters = [
  { id: "all", label: "ALL" },
  ...categories.map((c) => ({ id: c.id as string, label: c.filterLabel })),
];

const strongDisciplines: CategoryId[] = ["robotics", "hardware"];

/**
 * Stock cover images (Unsplash) for the coverflow showcase — one distinct
 * photo per project so no image repeats inside a category. All URLs were
 * verified to return 200. Swap any id to re-skin a card.
 */
const COVER_POOLS: Record<CategoryId, string[]> = {
  robotics: [
    "1485827404703-89b55fcc595e",
    "1535378917042-10a22c95931a",
    "1473968512647-3e447244af8f",
    "1561144257-e32e8efc6c4f",
    "1531746790731-6c087fecd65a",
    "1589254065878-42c9da997008",
    "1546776310-eef45dd6d63c",
  ],
  hardware: [
    "1518770660439-4636190af475",
    "1553406830-ef2513450d76",
    "1581092160562-40aa08e78837",
    "1581092918056-0c4c3acd3789",
  ],
  ai: [
    "1620712943543-bcc4688e7485",
    "1677442136019-21780ecad995",
    "1555949963-aa79dcee981c",
    "1526374965328-7f61d4dc18c5",
    "1597733336794-12d05021d510",
    "1655720828018-edd2daec9349",
  ],
  web: [
    "1461749280684-dccba630e2f6",
    "1498050108023-c5249f4df085",
    "1487058792275-0ad4aaf24ca7",
    "1517694712202-14dd9538aa97",
    "1531297484001-80022131f5a1",
    "1499951360447-b19be8fe80f5",
    "1460925895917-afdab827c52f",
  ],
  cyber: ["1550751827-4bd374c3f58b", "1563013544-824ae1b704d3"],
  mechanical: ["1613040809024-b4ef7ba99bc3", "1567789884554-0b844b597180"],
};

const coverSrc = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=640&h=640&fit=crop&q=70&auto=format`;

/** Coverflow slides for the currently visible projects, with real captions. */
function buildSlides(items: Project[]): CoverflowSlide[] {
  const cursor: Partial<Record<CategoryId, number>> = {};
  return items.map((project) => {
    const category = categories.find((c) => c.id === project.category)!;
    const pool = COVER_POOLS[project.category];
    const index = cursor[project.category] ?? 0;
    cursor[project.category] = index + 1;
    return {
      src: coverSrc(pool[index % pool.length]),
      alt: `${project.name} — ${category.title}`,
      title: project.name,
      subtitle: category.title,
      meta: [
        { label: "Status", value: project.status },
        { label: "Stack", value: project.tech.slice(0, 2).join(" + ") },
      ],
    };
  });
}

function ProjectPopup({
  project,
  category,
  onClose,
}: {
  project: Project;
  category: Category;
  onClose: () => void;
}) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const strong = strongDisciplines.includes(project.category);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      <button
        type="button"
        aria-label="Close details"
        onClick={onClose}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        className="absolute inset-0 h-full w-full cursor-default"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={project.name}
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.98 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="relative z-10 max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-black/10 bg-white p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-black/15 text-black/60 transition-colors hover:border-black/40 hover:text-black"
        >
          <X className="h-4 w-4" />
        </button>

        <p
          className="pr-10 font-mono text-[11px] uppercase tracking-[0.2em]"
          style={{ color: strong ? ACCENT : undefined }}
        >
          {category.index} · {category.title}
        </p>

        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-black sm:text-3xl">
          {project.name}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-black/15 px-2.5 py-1 font-mono text-[10px] uppercase leading-none tracking-[0.14em] text-black/60">
            {project.status}
          </span>
          <span className="font-mono text-[10px] uppercase leading-none tracking-[0.16em] text-black/40">
            {project.areas.join(" · ")}
          </span>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-black/75 sm:text-base">
          {project.description}
        </p>

        <div className="mt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45">
            Technology
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {project.tech.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 text-[11px] font-medium leading-none text-black/70"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-black/10 pt-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45">
            Key areas
          </p>
          <p className="mt-2 font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-black/65">
            {project.areas.join(" + ")}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const [active, setActive] = useState<string>("all");
  const [selected, setSelected] = useState<Project | null>(null);

  const visibleProjects =
    active === "all" ? projects : projects.filter((p) => p.category === active);

  const countFor = (id: string) =>
    id === "all" ? projects.length : projects.filter((p) => p.category === id).length;

  const selectedCategory = selected
    ? categories.find((c) => c.id === selected.category)!
    : null;

  return (
    <section id="work" className="border-t border-black/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs tracking-[0.22em] text-black">
            ENGINEERING PORTFOLIO
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black sm:text-5xl">
            Projects, by discipline.
          </h2>
          <p className="mt-4 text-black/70">
            Six disciplines of work — spin the coverflow, filter by discipline,
            then click any project to see what was built.
          </p>
        </div>

        {/* Category filter */}
        <div className="sticky top-[64px] z-30 -mx-4 mt-10 border-y border-black/10 bg-white/85 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
          <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filters.map((filter) => {
              const isActive = active === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActive(filter.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "relative shrink-0 rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors",
                    isActive
                      ? "border-black"
                      : "border-black/15 text-black/60 hover:border-black/40 hover:text-black",
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="projects-filter-pill"
                      className="absolute inset-0 rounded-full bg-black"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  <span
                    className={cn(
                      "relative z-10 whitespace-nowrap",
                      isActive && "text-white",
                    )}
                  >
                    {filter.label}
                    <span
                      className={cn(
                        "ml-2 text-[9px]",
                        isActive ? "text-white/55" : "text-black/35",
                      )}
                    >
                      {String(countFor(filter.id)).padStart(2, "0")}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtered content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            {/* Coverflow showcase — remounts per filter so it starts centred */}
            <div className="mt-10">
              <CoverflowCarousel
                slides={buildSlides(visibleProjects)}
                showCaption
                showPagination
                showNavigation
                label="Project coverflow"
                onSlideClick={(index) => setSelected(visibleProjects[index] ?? null)}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Project details popup */}
        <AnimatePresence>
          {selected && selectedCategory ? (
            <ProjectPopup
              project={selected}
              category={selectedCategory}
              onClose={() => setSelected(null)}
            />
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
