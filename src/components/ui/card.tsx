import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/utils/classnames";

type CardProps = {
  asChild?: boolean;
  divide?: boolean | "vertical" | "horizontal";
} & React.ComponentPropsWithoutRef<"div">;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { asChild = false, divide = false, className, children, ...props },
    forwardedRef,
  ) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        className={cn(
          "overflow-hidden rounded-lg bg-white shadow ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:shadow-none dark:ring-white/10",
          (divide === true || divide === "vertical") &&
            "divide-y divide-zinc-950/10 dark:divide-white/10",
          divide === "horizontal" &&
            "divide-x divide-zinc-950/10 dark:divide-white/10",
          className,
        )}
        ref={forwardedRef}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

Card.displayName = "Card";
