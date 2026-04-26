import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) =>
<div
  ref={ref}
  className={cn(
    "animate-fade-in rounded-lg border text-card-foreground shadow-sm",
    "transition-all duration-200 ease-out",
    "hover:scale-[1.02] active:scale-[0.98]",
    "cursor-pointer",
    className
  )}
  style={{
    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(0, 0, 0, 0.08) 100%), rgba(248, 247, 242, 0.05)",
    backdropFilter: "blur(8px)",
    boxShadow: "0 4px 24px -6px rgba(0, 0, 0, 0.25), 0 1px 2px rgba(0, 0, 0, 0.1)"
  }}
  {...props} />

);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) =>
  <div ref={ref} className={cn("flex flex-col space-y-2.5 p-6", className)} {...props} />

);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) =>
  <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight text-primary", className)} style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: 500, letterSpacing: '-0.01em' }} {...props} />

);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) =>
  <p ref={ref} className={cn("text-secondary-foreground text-base", className)} style={{ color: 'rgba(248, 247, 242, 0.52)' }} {...props} />

);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) =>
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />

);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };