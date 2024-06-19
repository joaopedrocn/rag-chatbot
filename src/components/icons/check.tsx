import * as React from "react";

export const CheckIcon = React.forwardRef<
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
      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
    </svg>
  );
});

CheckIcon.displayName = "CheckIcon";
