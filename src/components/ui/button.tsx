import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/classnames";

export const buttonClassNames = cva(
  [
    // Base
    "relative isolate inline-flex items-center justify-center gap-x-2 whitespace-nowrap rounded-md text-sm font-medium",
    // Focus state
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
    // Disabled state
    "disabled:pointer-events-none disabled:opacity-50",
    // Icon
    "[&>[data-slot=icon]]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: [
          // Base
          "bg-zinc-900 text-white dark:bg-zinc-600 dark:highlight-white/15",
          // Hover state
          "after:hover:bg-white/10 dark:after:hover:bg-white/5",
          // Icon
          "[&>[data-slot=icon]]:text-white",
        ],
        secondary: [
          // Base
          "bg-white text-zinc-900 ring-1 ring-inset ring-zinc-950/15 dark:bg-white/[7.5%] dark:text-white dark:ring-0 dark:highlight-white/10",
          // Hover state
          "after:hover:bg-zinc-950/[2.5%] dark:after:hover:bg-white/[2.5%]",
          // Disabled state
          "disabled:bg-zinc-950/10 disabled:ring-0 dark:disabled:bg-white/[12.5%]",
          // Icon
          "[&>[data-slot=icon]]:text-zinc-600 [&>[data-slot=icon]]:hover:text-zinc-700 [&>[data-slot=icon]]:dark:text-zinc-300 [&>[data-slot=icon]]:dark:hover:text-zinc-200",
        ],
        destructive: [
          // Base
          "bg-red-600 text-white dark:highlight-white/25",
          // Hover state
          "after:hover:bg-white/10",
          // Icon
          "[&>[data-slot=icon]]:text-white",
        ],
        ghost: [
          // Base
          "text-zinc-900 dark:text-white",
          // Hover state
          "hover:bg-zinc-950/5 dark:hover:bg-white/5",
          // Icon
          "[&>[data-slot=icon]]:text-zinc-600 [&>[data-slot=icon]]:hover:text-zinc-700 [&>[data-slot=icon]]:dark:text-zinc-400 [&>[data-slot=icon]]:dark:hover:text-zinc-300",
        ],
        link: [
          // Base
          "underline text-zinc-900 dark:text-white !justify-start !rounded-sm underline-offset-2 decoration-zinc-900/50 dark:decoration-white/50",
          // Hover state
          "hover:decoration-zinc-900 dark:hover:decoration-white",
          // Icon
          "[&>[data-slot=icon]]:text-zinc-600 [&>[data-slot=icon]]:hover:text-zinc-700 [&>[data-slot=icon]]:dark:text-zinc-400 [&>[data-slot=icon]]:dark:hover:text-zinc-300",
        ],
      },
      size: {
        regular: null,
        icon: null,
      },
    },
    compoundVariants: [
      {
        variant: ["primary", "secondary", "destructive"],
        className: [
          // Base
          "shadow-sm dark:shadow-none",
          // Hover state
          "after:absolute after:inset-0 after:-z-10 after:rounded-md",
          // Disabled state
          "disabled:shadow-none dark:disabled:highlight-none",
        ],
      },
      {
        variant: ["primary", "secondary", "destructive", "ghost"],
        size: "regular",
        className: "px-3 py-1.5",
      },
      {
        variant: ["primary", "secondary", "destructive", "ghost"],
        size: "icon",
        className: "p-2",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "regular",
    },
  },
);

type ButtonProps = {
  variant?: "primary" | "secondary" | "destructive" | "ghost" | "link";
  size?: "regular" | "icon";
} & React.ComponentPropsWithoutRef<"button">;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = "button",
      variant = "primary",
      size = "regular",
      className,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    return (
      <button
        type={type}
        className={cn(buttonClassNames({ variant, size }), className)}
        ref={forwardedRef}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
