"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/classnames";

export const inputClassNames = cva([
  // Base
  "block w-full appearance-none rounded-md bg-white px-3 py-1.5 text-sm text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-950/15 placeholder:text-zinc-500 dark:bg-zinc-900 dark:text-white dark:shadow-none dark:ring-white/15 dark:placeholder:text-zinc-500",
  // Focus state
  "outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:focus:ring-indigo-500",
  // Invalid state
  "aria-[invalid=true]:ring-red-500 focus:aria-[invalid=true]:ring-red-500 dark:aria-[invalid=true]:ring-red-500 dark:focus:aria-[invalid=true]:ring-red-500",
  // Disabled state
  "disabled:bg-zinc-950/5 disabled:opacity-50 disabled:shadow-none disabled:!ring-zinc-950/20 dark:disabled:bg-white/5 dark:disabled:!ring-white/15 disabled:placeholder:text-zinc-600 dark:disabled:placeholder:text-zinc-400",
]);

type InputProps = {
  type?: "text" | "email" | "password" | "search" | "url" | "tel";
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  unstyled?: boolean;
} & Omit<
  React.ComponentPropsWithoutRef<"input">,
  "type" | "defaultValue" | "value" | "onChange"
>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      defaultValue = "",
      value: controlledValue,
      onValueChange: setControlledValue,
      unstyled = false,
      className,
      ...props
    },
    forwardedRef,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] =
      React.useState(defaultValue);
    const value = controlledValue ?? uncontrolledValue;
    const setValue = setControlledValue ?? setUncontrolledValue;

    return (
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn(!unstyled && inputClassNames(), className)}
        ref={forwardedRef}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
