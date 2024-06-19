import * as React from "react";
import { cn } from "@/utils/classnames";

export const ErrorMessage = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<"p">
>(({ className, children, ...props }, forwardedRef) => {
  return (
    <p
      data-slot="error-message"
      className={cn(
        "text-sm text-red-600 group-has-[[data-slot=control]:disabled]/field:opacity-60 group-has-[[data-slot=control][contenteditable=false]]/field:opacity-60 dark:text-red-500",
        className,
      )}
      ref={forwardedRef}
      {...props}
    >
      {children}
    </p>
  );
});

ErrorMessage.displayName = "ErrorMessage";
