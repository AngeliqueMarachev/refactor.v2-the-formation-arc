import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200 focus-visible:outline-none outline-none ring-0 focus:ring-0 focus-visible:ring-0",
          className,
        )}
        style={{
          border: "1px solid rgba(168, 192, 168, 0.35)",
          backgroundColor: "rgba(12, 70, 81, 0.35)",
          color: "hsl(var(--foreground))",
        }}
        onFocus={(e) => {
          (e.target as HTMLInputElement).style.borderColor = "rgba(168, 192, 168, 0.6)";
        }}
        onBlur={(e) => {
          (e.target as HTMLInputElement).style.borderColor = "rgba(168, 192, 168, 0.35)";
        }}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
