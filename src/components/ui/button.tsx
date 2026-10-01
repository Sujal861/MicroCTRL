import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-black",
  {
    variants: {
      variant: {
        default:
          "rounded-full border border-white/80 bg-white/70 text-black shadow-[0_20px_50px_-12px_rgba(0,0,0,0.28)] backdrop-blur-xl hover:bg-white",
        outline:
          "rounded-full border border-white/80 bg-white/40 text-black shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] backdrop-blur-xl hover:bg-white",
        ghost: "rounded-full bg-transparent text-black hover:bg-white/70",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-9 px-3 text-xs",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
