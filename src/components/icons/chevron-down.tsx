import * as React from "react";

export const ChevronDownIcon = React.forwardRef<
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
      <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z" />
    </svg>
  );
});

ChevronDownIcon.displayName = "ChevronDownIcon";
