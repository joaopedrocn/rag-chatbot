"use client";

import * as React from "react";
import { cn } from "@/utils/classnames";
import { inputClassNames } from "./input";

type TextareaProps = {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
} & Omit<
  React.ComponentPropsWithoutRef<"textarea">,
  "defaultValue" | "value" | "onChange"
>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      rows = 3,
      defaultValue = "",
      value: controlledValue,
      onValueChange: setControlledValue,
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
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn(inputClassNames(), "min-h-[3.25rem] resize-y", className)}
        ref={forwardedRef}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
