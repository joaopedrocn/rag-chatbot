import * as React from "react";
import Link from "next/link";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/classnames";

type TextSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | null;

type TextWeight = "light" | "normal" | "medium" | "semibold" | "bold" | null;

type BaseTextProps = {
  size?: TextSize;
  weight?: TextWeight;
};

const textClassNames = cva("", {
  variants: {
    size: {
      null: "",
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
    },
    weight: {
      null: "",
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  compoundVariants: [
    {
      weight: ["null", "light", "normal"],
      className: "text-zinc-600 dark:text-zinc-400",
    },
    {
      weight: ["medium", "semibold", "bold"],
      className: "text-zinc-900 dark:text-white",
    },
  ],
});

/* -------------------------------------------------------------------------- */
/*                                    TEXT                                    */
/* -------------------------------------------------------------------------- */

type Text = "p" | "span";

type TextProps<T extends Text> = { as?: T } & BaseTextProps &
  React.ComponentPropsWithoutRef<T>;

export const Text = <T extends Text = "p">({
  as,
  size = "sm",
  weight = "normal",
  className,
  children,
  ...props
}: TextProps<T>) => {
  const Comp = as || "p";
  return (
    <Comp
      data-slot="text"
      className={cn(
        textClassNames({ size, weight }),
        "text-pretty group-[:not(:has([data-slot=control]:enabled,[contenteditable=true]))]/fieldset:opacity-60",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   HEADING                                  */
/* -------------------------------------------------------------------------- */

type Heading = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const HEADING_SIZES_MAP: Record<Heading, TextSize> = {
  h1: "2xl",
  h2: "lg",
  h3: "base",
  h4: "sm",
  h5: "sm",
  h6: "sm",
};

type HeadingProps<T extends Heading> = { as?: T } & BaseTextProps &
  React.ComponentPropsWithoutRef<T>;

export const Heading = <T extends Heading = "h1">({
  as,
  size,
  weight = "medium",
  className,
  children,
  ...props
}: HeadingProps<T>) => {
  const Comp = as || "h1";

  return (
    <Comp
      data-slot="heading"
      className={cn(
        textClassNames({
          size: size === undefined ? HEADING_SIZES_MAP[Comp] : size,
          weight,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   STRONG                                   */
/* -------------------------------------------------------------------------- */

type StrongProps = BaseTextProps & React.ComponentPropsWithoutRef<"strong">;

export const Strong = React.forwardRef<HTMLElement, StrongProps>(
  (
    { size = null, weight = "semibold", className, children, ...props },
    forwardedRef,
  ) => {
    return (
      <strong
        className={cn(textClassNames({ size, weight }), className)}
        ref={forwardedRef}
        {...props}
      >
        {children}
      </strong>
    );
  },
);

Strong.displayName = "Strong";

/* -------------------------------------------------------------------------- */
/*                                  TEXT LINK                                 */
/* -------------------------------------------------------------------------- */

type TextLinkProps = BaseTextProps &
  React.ComponentPropsWithoutRef<typeof Link>;

export const TextLink = React.forwardRef<
  React.ElementRef<typeof Link>,
  TextLinkProps
>(
  (
    { size = "sm", weight = "medium", className, children, ...props },
    forwardedRef,
  ) => {
    return (
      <Link
        className={cn(
          // Base
          textClassNames({ size, weight }),
          "rounded-sm underline decoration-zinc-900/50 underline-offset-2 hover:decoration-zinc-900 dark:decoration-white/50 dark:hover:decoration-white",
          // Focus state
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
          className,
        )}
        ref={forwardedRef}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

TextLink.displayName = "TextLink";
