"use client";

import * as React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { cn } from "@/utils/classnames";

/* -------------------------------------------------------------------------- */
/*                                   DIALOG                                   */
/* -------------------------------------------------------------------------- */

export const Dialog = RadixDialog.Root;

/* -------------------------------------------------------------------------- */
/*                               DIALOG TRIGGER                               */
/* -------------------------------------------------------------------------- */

export const DialogTrigger = RadixDialog.Trigger;

/* -------------------------------------------------------------------------- */
/*                                DIALOG PANEL                                */
/* -------------------------------------------------------------------------- */

type DialogPanelProps = {
  size?: "small" | "medium" | "large" | "extra-large";
  layout?: boolean;
} & React.ComponentPropsWithoutRef<typeof RadixDialog.Content>;

export const DialogPanel = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Content>,
  DialogPanelProps
>(
  (
    {
      size = "medium",
      layout = true,
      onPointerDownOutside,
      className,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    return (
      <RadixDialog.Portal>
        <RadixDialog.Overlay
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/10 p-4 backdrop-blur-sm transition-opacity sm:p-10 lg:p-16 dark:bg-zinc-950/50",
            // Open animation
            "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:duration-300 data-[state=open]:ease-out",
            // Close animation
            "data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:duration-200 data-[state=closed]:ease-in",
          )}
        >
          <RadixDialog.Content
            onPointerDownOutside={(e) => {
              if (
                e.target instanceof Element &&
                e.target.closest("[data-sonner-toast]")
              ) {
                e.preventDefault();
              }
              onPointerDownOutside?.(e);
            }}
            className={cn(
              "relative max-h-full w-full overflow-hidden rounded-xl bg-white shadow-xl outline-none ring-1 ring-zinc-950/5 transition-transform dark:bg-zinc-900 dark:ring-inset dark:ring-white/10",
              size === "small" && "max-w-md",
              size === "medium" && "max-w-xl",
              size === "large" && "max-w-4xl",
              size === "extra-large" && "max-w-[76rem]",
              layout && "flex flex-col",
              // Open animation
              "data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:duration-300 data-[state=open]:ease-out",
              // Close animation
              "data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=closed]:duration-200 data-[state=closed]:ease-in",
              className,
            )}
            ref={forwardedRef}
            {...props}
          >
            {children}
          </RadixDialog.Content>
        </RadixDialog.Overlay>
      </RadixDialog.Portal>
    );
  },
);

DialogPanel.displayName = "DialogPanel";

/* -------------------------------------------------------------------------- */
/*                             DIALOG CLOSE BUTTON                            */
/* -------------------------------------------------------------------------- */

export const DialogCloseButton = RadixDialog.Close;

/* -------------------------------------------------------------------------- */
/*                                DIALOG TITLE                                */
/* -------------------------------------------------------------------------- */

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Title>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Title>
>(({ className, children, ...props }, forwardedRef) => {
  return (
    <RadixDialog.Title
      className={cn("font-medium text-zinc-900 dark:text-white", className)}
      ref={forwardedRef}
      {...props}
    >
      {children}
    </RadixDialog.Title>
  );
});

DialogTitle.displayName = "DialogTitle";

/* -------------------------------------------------------------------------- */
/*                             DIALOG DESCRIPTION                             */
/* -------------------------------------------------------------------------- */

export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Description>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Description>
>(({ className, children, ...props }, forwardedRef) => {
  return (
    <RadixDialog.Description
      className={cn(
        "text-pretty text-sm text-zinc-600 dark:text-zinc-400",
        className,
      )}
      ref={forwardedRef}
      {...props}
    >
      {children}
    </RadixDialog.Description>
  );
});

DialogDescription.displayName = "DialogDescription";

/* -------------------------------------------------------------------------- */
/*                                DIALOG HEADER                               */
/* -------------------------------------------------------------------------- */

export const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, forwardedRef) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-x-6 border-b border-zinc-950/10 px-6 py-4 dark:border-white/10",
        className,
      )}
      ref={forwardedRef}
      {...props}
    >
      {children}
    </div>
  );
});

DialogHeader.displayName = "DialogHeader";

/* -------------------------------------------------------------------------- */
/*                                 DIALOG BODY                                */
/* -------------------------------------------------------------------------- */

export const DialogBody = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, forwardedRef) => {
  return (
    <div
      className={cn("flex-1 overflow-y-auto p-6", className)}
      ref={forwardedRef}
      {...props}
    >
      {children}
    </div>
  );
});

DialogBody.displayName = "DialogBody";

/* -------------------------------------------------------------------------- */
/*                                DIALOG FOOTER                               */
/* -------------------------------------------------------------------------- */

export const DialogFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, forwardedRef) => {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-end gap-4 border-t border-zinc-950/10 px-6 py-4 dark:border-white/10",
        className,
      )}
      ref={forwardedRef}
      {...props}
    >
      {children}
    </div>
  );
});

DialogFooter.displayName = "DialogFooter";
