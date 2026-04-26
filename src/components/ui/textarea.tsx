import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, onInput, ...props }, ref) => {
  const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

  const resize = (el: HTMLTextAreaElement) => {
    const savedMinHeight = el.style.minHeight;
    el.style.minHeight = "0px";
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
    el.style.minHeight = savedMinHeight;
  };

  React.useEffect(() => {
    if (innerRef.current) resize(innerRef.current);
  }, [props.value, props.defaultValue]);

  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md px-3 py-2 text-base md:text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 focus-visible:outline-none outline-none ring-0 focus:ring-0 focus-visible:ring-0",
        className,
      )}
      style={{
        border: "1px solid rgba(168, 192, 168, 0.35)",
        backgroundColor: "rgba(12, 70, 81, 0.35)",
        color: "hsl(var(--foreground))",
        overflow: "hidden",
      }}
      onFocus={(e) => {
        (e.target as HTMLTextAreaElement).style.borderColor = "rgba(168, 192, 168, 0.6)";
      }}
      onBlur={(e) => {
        (e.target as HTMLTextAreaElement).style.borderColor = "rgba(168, 192, 168, 0.35)";
      }}
      onInput={(e) => {
        resize(e.target as HTMLTextAreaElement);
        onInput?.(e);
      }}
      ref={(node) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      }}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
