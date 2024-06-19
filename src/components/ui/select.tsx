"use client";

import * as React from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/classnames";
import { CheckIcon } from "../icons/check";

/* -------------------------------------------------------------------------- */
/*                                   SELECT                                   */
/* -------------------------------------------------------------------------- */

export const Select = RadixSelect.Root;

/* -------------------------------------------------------------------------- */
/*                               SELECT TRIGGER                               */
/* -------------------------------------------------------------------------- */

export const selectTriggerClassNames = cva(
  [
    // Base
    "block min-h-8 w-full truncate rounded-md py-1.5 text-left text-sm text-zinc-900 data-[placeholder]:text-zinc-500 dark:text-white dark:data-[placeholder]:text-zinc-500",
    // Disabled state
    "data-[disabled]:opacity-50",
  ],
  {
    variants: {
      variant: {
        solid: [
          // Base
          "select-indicator bg-white pl-3 pr-10 shadow-sm ring-1 ring-inset ring-zinc-950/15 dark:bg-zinc-900 dark:shadow-none dark:ring-white/15",
          // Focus state
          "outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:focus:ring-indigo-500",
          // Invalid state
          "aria-[invalid=true]:ring-red-500 focus:aria-[invalid=true]:ring-red-500 dark:aria-[invalid=true]:ring-red-500 dark:focus:aria-[invalid=true]:ring-red-500",
          // Disabled state
          "data-[disabled]:bg-zinc-950/5 data-[disabled]:shadow-none data-[disabled]:!ring-zinc-950/20 dark:data-[disabled]:bg-white/5 dark:data-[disabled]:!ring-white/15 data-[disabled]:data-[placeholder]:text-zinc-600 dark:data-[disabled]:data-[placeholder]:text-zinc-400",
        ],
        ghost: [
          // Base
          "select-indicator-sm pl-3 pr-9",
          // Hover state
          "hover:bg-zinc-950/5 dark:hover:bg-white/5",
          // Focus state
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
          // Disabled state
          "data-[disabled]:pointer-events-none",
        ],
      },
    },
    defaultVariants: {
      variant: "solid",
    },
  },
);

type SelectTriggerProps = {
  variant?: "solid" | "ghost";
  unstyled?: boolean;
} & React.ComponentPropsWithoutRef<typeof RadixSelect.Trigger>;

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof RadixSelect.Trigger>,
  SelectTriggerProps
>(
  (
    { variant = "solid", unstyled = false, className, children, ...props },
    forwardedRef,
  ) => {
    return (
      <RadixSelect.Trigger
        className={cn(
          !unstyled && selectTriggerClassNames({ variant }),
          className,
        )}
        ref={forwardedRef}
        {...props}
      >
        {children}
      </RadixSelect.Trigger>
    );
  },
);

SelectTrigger.displayName = "SelectTrigger";

/* -------------------------------------------------------------------------- */
/*                                SELECT VALUE                                */
/* -------------------------------------------------------------------------- */

export const SelectValue = React.forwardRef<
  React.ElementRef<typeof RadixSelect.Value>,
  React.ComponentPropsWithoutRef<typeof RadixSelect.Value>
>(({ placeholder = "Selecione...", children, ...props }, forwardedRef) => {
  return (
    <RadixSelect.Value placeholder={placeholder} {...props} ref={forwardedRef}>
      {children}
    </RadixSelect.Value>
  );
});

SelectValue.displayName = "SelectValue";

/* -------------------------------------------------------------------------- */
/*                                SELECT PANEL                                */
/* -------------------------------------------------------------------------- */

export const SelectPanel = React.forwardRef<
  React.ElementRef<typeof RadixSelect.Content>,
  React.ComponentPropsWithoutRef<typeof RadixSelect.Content>
>(
  (
    {
      position = "popper",
      sideOffset = 8,
      collisionPadding = 8,
      className,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    return (
      <RadixSelect.Portal>
        <RadixSelect.Content
          position={position}
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          className={cn(
            "z-50 max-h-[--radix-select-content-available-height] min-w-[--radix-select-trigger-width] overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-zinc-950/5 dark:bg-zinc-800 dark:ring-inset dark:ring-white/10",
            position === "popper" && [
              "transition",
              // Open animation
              "data-[state=open]:duration-100 data-[state=open]:ease-out data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95",
              // Close animation
              "data-[state=closed]:duration-75 data-[state=closed]:ease-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95",
            ],
            className,
          )}
          ref={forwardedRef}
          {...props}
        >
          <RadixSelect.Viewport
            data-radix-select-viewport={undefined}
            className="scroll-py-1 p-1"
          >
            {children}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    );
  },
);

SelectPanel.displayName = "SelectPanel";

/* -------------------------------------------------------------------------- */
/*                                SELECT GROUP                                */
/* -------------------------------------------------------------------------- */

export const SelectGroup = RadixSelect.Group;

/* -------------------------------------------------------------------------- */
/*                                 SELECT ITEM                                */
/* -------------------------------------------------------------------------- */

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof RadixSelect.Item>,
  React.ComponentPropsWithoutRef<typeof RadixSelect.Item>
>(({ className, children, ...props }, forwardedRef) => {
  return (
    <RadixSelect.Item
      className={cn(
        // Base
        "group relative flex cursor-pointer select-none items-center rounded-md py-1.5 pl-3 pr-10 text-sm text-zinc-900 outline-none dark:text-white",
        // Highlighted state
        "data-[highlighted]:bg-zinc-950/5 dark:data-[highlighted]:bg-white/5",
        // Disabled state
        "data-[disabled]:cursor-default data-[disabled]:opacity-60",
        className,
      )}
      ref={forwardedRef}
      {...props}
    >
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>

      <RadixSelect.ItemIndicator className="absolute inset-y-0 right-3 flex items-center justify-center">
        <CheckIcon className="text-zinc-500 group-data-[highlighted]:text-zinc-600 dark:text-zinc-400 dark:group-data-[highlighted]:text-zinc-300" />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  );
});

SelectItem.displayName = "SelectItem";

/* -------------------------------------------------------------------------- */
/*                                SELECT LABEL                                */
/* -------------------------------------------------------------------------- */

export const SelectLabel = React.forwardRef<
  React.ElementRef<typeof RadixSelect.Label>,
  React.ComponentPropsWithoutRef<typeof RadixSelect.Label>
>(({ className, children, ...props }, forwardedRef) => {
  return (
    <RadixSelect.Label
      className={cn(
        "px-3 py-2 text-xs font-medium tracking-wide text-zinc-500 dark:text-zinc-400",
        className,
      )}
      ref={forwardedRef}
      {...props}
    >
      {children}
    </RadixSelect.Label>
  );
});

SelectLabel.displayName = "SelectLabel";

/* -------------------------------------------------------------------------- */
/*                              SELECT SEPARATOR                              */
/* -------------------------------------------------------------------------- */

export const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof RadixSelect.Separator>,
  React.ComponentPropsWithoutRef<typeof RadixSelect.Separator>
>(({ className, children, ...props }, forwardedRef) => {
  return (
    <RadixSelect.Separator
      className={cn("-mx-1 my-1 h-px bg-zinc-950/5 dark:bg-white/5", className)}
      ref={forwardedRef}
      {...props}
    >
      {children}
    </RadixSelect.Separator>
  );
});

SelectSeparator.displayName = "SelectSeparator";
