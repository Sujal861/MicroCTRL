"use client";

import React, { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";

interface PerspectiveGridProps {
  className?: string;
  gridSize?: number;
  showOverlay?: boolean;
  fadeRadius?: number;
}

export function PerspectiveGrid({
  className,
  gridSize = 40,
  showOverlay = true,
  fadeRadius = 80,
}: PerspectiveGridProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const tiles = useMemo(() => Array.from({ length: gridSize * gridSize }), [gridSize]);

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-white",
        "[--fade-stop:#ffffff]",
        className,
      )}
      style={{ perspective: "2000px", transformStyle: "preserve-3d" }}
    >
      <div
        className="absolute grid aspect-square w-[80rem] origin-center"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%) rotateX(30deg) rotateY(-5deg) rotateZ(20deg) scale(2)",
          transformStyle: "preserve-3d",
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {mounted &&
          tiles.map((_, i) => (
            <div
              key={i}
              className="tile min-h-px min-w-px border border-neutral-300 bg-transparent transition-colors duration-[1500ms] hover:bg-neutral-100 hover:duration-0"
            />
          ))}
      </div>
      {showOverlay ? (
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: `radial-gradient(circle, transparent 25%, var(--fade-stop) ${fadeRadius}%)`,
          }}
        />
      ) : null}
    </div>
  );
}

export default PerspectiveGrid;
