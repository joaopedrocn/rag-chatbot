import * as React from "react";

export const LoaderIcon = React.forwardRef<
  React.ElementRef<"svg">,
  React.ComponentPropsWithoutRef<"svg">
>(({ "aria-label": ariaLabel, ...props }, forwardedRef) => {
  return (
    <svg
      data-slot="icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      fill="currentColor"
      role="img"
      aria-hidden={ariaLabel ? false : true}
      aria-label={ariaLabel}
      ref={forwardedRef}
      {...props}
    >
      <path d="M8 1.5A6.5 6.5 0 1 0 14.5 8 .75.75 0 0 1 16 8a8 8 0 1 1-8-8 .75.75 0 0 1 0 1.5Z" />
    </svg>
  );
});

LoaderIcon.displayName = "LoaderIcon";
