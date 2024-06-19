import * as React from "react";
import { cn } from "@/utils/classnames";

export const Description = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<"p">
>(({ className, children, ...props }, forwardedRef) => {
  return (
    <p
      data-slot="description"
      className={cn(
        "text-sm text-zinc-600 group-has-[[data-slot=control]:disabled]/field:opacity-60 group-has-[[data-slot=control][contenteditable=false]]/field:opacity-60 dark:text-zinc-400",
        className,
      )}
      ref={forwardedRef}
      {...props}
    >
      {children}
    </p>
  );
});

Description.displayName = "Description";
