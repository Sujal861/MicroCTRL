"use client";

import React, { memo, forwardRef } from "react";
import { LiquidMetal as LiquidMetalShader } from "@paper-design/shaders-react";
import { cn } from "@/lib/utils";

export interface LiquidMetalProps {
  colorBack?: string;
  colorTint?: string;
  speed?: number;
  repetition?: number;
  distortion?: number;
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const LiquidMetal = memo(function LiquidMetal({
  colorBack = "#aaaaac",
  colorTint = "#ffffff",
  speed = 0.5,
  repetition = 4,
  distortion = 0.1,
  scale = 1,
  className,
  style,
}: LiquidMetalProps) {
  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden", className)} style={style}>
      <LiquidMetalShader
        colorBack={colorBack}
        colorTint={colorTint}
        speed={speed}
        repetition={repetition}
        distortion={distortion}
        softness={0}
        shiftRed={0.3}
        shiftBlue={-0.3}
        angle={45}
        shape="none"
        scale={scale}
        fit="cover"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
});

LiquidMetal.displayName = "LiquidMetal";

export interface LiquidMetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  borderWidth?: number;
  metalConfig?: Omit<LiquidMetalProps, "className" | "style">;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export const LiquidMetalButton = forwardRef<HTMLButtonElement, LiquidMetalButtonProps>(
  ({ children, icon, borderWidth = 4, metalConfig, size = "md", className, disabled, href, ...props }, ref) => {
    const sizeStyles = {
      sm: icon ? "py-2 pl-2 pr-6 gap-3 text-sm" : "px-5 py-2 text-sm",
      md: icon ? "py-3 pl-3 pr-8 gap-4 text-base" : "px-6 py-3 text-base",
      lg: icon ? "py-4 pl-4 pr-10 gap-6 text-lg" : "px-8 py-4 text-lg",
    };
    const iconSizes = {
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-12 h-12",
    };

    const shell = cn(
      "relative group inline-flex cursor-pointer border-none bg-transparent p-0 text-left no-underline outline-none transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none",
      className,
    );
    const inner = (
      <>
        <div
          className="relative w-full overflow-hidden rounded-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)]"
          style={{ padding: borderWidth }}
        >
          <LiquidMetal
            colorBack={metalConfig?.colorBack ?? "#888888"}
            colorTint={metalConfig?.colorTint ?? "#ffffff"}
            speed={metalConfig?.speed ?? 0.4}
            repetition={metalConfig?.repetition ?? 4}
            distortion={metalConfig?.distortion ?? 0.15}
            scale={metalConfig?.scale ?? 1}
            className="absolute inset-0 z-0 rounded-full"
          />
          <div
            className={cn(
              "relative z-10 flex items-center rounded-full bg-white/75 backdrop-blur-xl transition-colors duration-200 group-hover:bg-white/90",
              sizeStyles[size],
            )}
          >
            {icon ? (
              <div
                className={cn(
                  "flex items-center justify-center rounded-full bg-neutral-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]",
                  iconSizes[size],
                )}
              >
                <span className="text-neutral-700">{icon}</span>
              </div>
            ) : null}
            <span className="font-medium tracking-tight text-neutral-900">{children}</span>
          </div>
        </div>
      </>
    );

    if (href) {
      return (
        <a href={href} className={shell} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {inner}
        </a>
      );
    }

    return (
      <button ref={ref} disabled={disabled} className={shell} {...props}>
        {inner}
      </button>
    );
  },
);

LiquidMetalButton.displayName = "LiquidMetalButton";

export default LiquidMetalButton;
