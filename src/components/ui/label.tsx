"use client";

import * as React from "react";
import * as RadixLabel from "@radix-ui/react-label";
import { cn } from "@/utils/classnames";

type LabelProps = {
  decorative?: boolean;
} & React.ComponentPropsWithoutRef<typeof RadixLabel.Root>;

export const Label = React.forwardRef<
  React.ElementRef<typeof RadixLabel.Root>,
  LabelProps
>(({ decorative = false, className, children, ...props }, forwardedRef) => {
  const Comp = decorative ? "span" : RadixLabel.Root;

  return (
    <Comp
      data-slot="label"
      className={cn(
        "cursor-default text-sm font-medium text-zinc-900 group-has-[[data-slot=control]:disabled]/field:opacity-60 group-has-[[data-slot=control][contenteditable=false]]/field:opacity-60 dark:text-white",
        className,
      )}
      ref={forwardedRef}
      {...props}
    >
      {children}
    </Comp>
  );
});

Label.displayName = "Label";
