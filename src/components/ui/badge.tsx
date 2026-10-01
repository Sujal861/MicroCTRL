import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center border border-black px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.16em] text-black",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
