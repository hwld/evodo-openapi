import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 whitespace-nowrap focus-visible:ring-offset-background select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [&.interactive]:hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [&.interactive]:hover:bg-secondary/80",
        destructive:
          "border-destructive text-destructive [&.interactive]:hover:bg-destructive/40",
        success:
          "border-success text-success [&.interactive]:hover:bg-success/40",
        outline: "text-foreground",
      },
      size: {
        default: "h-7 text-sm px-3 py-1",
        sm: "text-xs px-2 py-0.5",
      },
      interactive: {
        true: "interactive",
        false: "",
      },
    },
  },
);

export type BadgeProps = VariantProps<typeof badgeVariants> & {
  className?: string;
  onClick?: () => void;
  button?: boolean;
  children: React.ReactNode;
};

function Badge({
  className,
  variant = "default",
  size = "default",
  ...props
}: BadgeProps) {
  const isInteractive = !!props.onClick;
  const Comp = isInteractive ? "button" : "div";
  return (
    <Comp
      className={cn(
        badgeVariants({ variant, size, interactive: isInteractive }),
        className,
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
