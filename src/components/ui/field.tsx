"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/utils/classnames";
import { Description } from "./description";
import { ErrorMessage } from "./error-message";
import { Label } from "./label";

/* -------------------------------------------------------------------------- */
/*                              FIELDSET CONTEXT                              */
/* -------------------------------------------------------------------------- */

type FieldsetContextValue = {
  id: string;
  legendId: string;
};

const FieldsetContext = React.createContext<FieldsetContextValue | null>(null);

const useFieldset = () => {
  const context = React.useContext(FieldsetContext);

  if (!context) {
    throw new Error("useFieldset must be used within a Fieldset.");
  }

  return context;
};

/* -------------------------------------------------------------------------- */
/*                                  FIELDSET                                  */
/* -------------------------------------------------------------------------- */

export const Fieldset = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, forwardedRef) => {
  const id = React.useId();

  const contextValue: FieldsetContextValue = {
    id,
    legendId: `fieldset-legend-${id}`,
  };

  return (
    <FieldsetContext.Provider value={contextValue}>
      <div
        role="group"
        data-slot="fieldset"
        aria-labelledby={contextValue.legendId}
        className={cn(
          "group/fieldset [&>*+[data-slot=field-group]]:mt-6 [&>[data-slot=legend]+[data-slot=text]]:mt-1",
          className,
        )}
        ref={forwardedRef}
        {...props}
      >
        {children}
      </div>
    </FieldsetContext.Provider>
  );
});

Fieldset.displayName = "Fieldset";

/* -------------------------------------------------------------------------- */
/*                                   LEGEND                                   */
/* -------------------------------------------------------------------------- */

export const Legend = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, forwardedRef) => {
  const { legendId } = useFieldset();

  return (
    <div
      id={legendId}
      data-slot="legend"
      className={cn(
        "text-sm font-medium text-zinc-900 group-[:not(:has([data-slot=control]:enabled,[contenteditable=true]))]/fieldset:opacity-60 dark:text-white",
        className,
      )}
      ref={forwardedRef}
      {...props}
    >
      {children}
    </div>
  );
});

Legend.displayName = "Legend";

/* -------------------------------------------------------------------------- */
/*                                FIELD CONTEXT                               */
/* -------------------------------------------------------------------------- */

type FieldContextValue = {
  id: string;
  isInvalid: boolean;
  setIsInvalid: React.Dispatch<React.SetStateAction<boolean>>;
  labelId: string;
  controlId: string;
  descriptionId: string;
  errorMessageId: string;
};

const FieldContext = React.createContext<FieldContextValue | null>(null);

const useField = () => {
  const context = React.useContext(FieldContext);

  if (!context) {
    throw new Error("useField must be used within a Field.");
  }

  return context;
};

/* -------------------------------------------------------------------------- */
/*                                    FIELD                                   */
/* -------------------------------------------------------------------------- */

type FieldProps = {
  layout?: "default" | "radio" | "checkbox" | "switch" | "switch-2" | false;
} & React.ComponentPropsWithoutRef<"div">;

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ layout = "default", className, children, ...props }, forwardedRef) => {
    const id = React.useId();

    const [isInvalid, setIsInvalid] = React.useState(false);

    const contextValue: FieldContextValue = {
      id,
      isInvalid,
      setIsInvalid,
      labelId: `field-label-${id}`,
      controlId: `field-control-${id}`,
      descriptionId: `field-description-${id}`,
      errorMessageId: `field-error-message-${id}`,
    };

    return (
      <FieldContext.Provider value={contextValue}>
        <div
          data-slot="field"
          className={cn(
            "group/field",
            layout === "default" &&
              "flex flex-col gap-y-2 [&>[data-slot=label]]:self-start",
            layout === "radio" && [
              // Base
              "grid grid-cols-[1rem_1fr] items-center gap-x-4 gap-y-1",
              // Control
              "[&>[data-slot=control]]:col-start-1 [&>[data-slot=control]]:row-start-1 [&>[data-slot=control]]:justify-self-center",
              // Label
              "[&>[data-slot=label]]:col-start-2 [&>[data-slot=label]]:row-start-1 [&>[data-slot=label]]:justify-self-start",
              // Description
              "[&>[data-slot=description]]:col-start-2 [&>[data-slot=description]]:row-start-2",
            ],
            layout === "checkbox" && [
              // Base
              "grid grid-cols-[1rem_1fr] items-center gap-x-4 gap-y-1",
              // Control
              "[&>[data-slot=control]]:col-start-1 [&>[data-slot=control]]:row-start-1 [&>[data-slot=control]]:justify-self-center",
              // Label
              "[&>[data-slot=label]]:col-start-2 [&>[data-slot=label]]:row-start-1 [&>[data-slot=label]]:justify-self-start",
              // Description
              "[&>[data-slot=description]]:col-start-2 [&>[data-slot=description]]:row-start-2",
            ],
            layout === "switch" && [
              // Base
              "grid grid-cols-[1fr_auto] items-center gap-x-8 gap-y-1",
              // Control
              "[&>[data-slot=control]]:col-start-2 [&>[data-slot=control]]:self-center",
              // Label
              "[&>[data-slot=label]]:col-start-1 [&>[data-slot=label]]:row-start-1 [&>[data-slot=label]]:justify-self-start",
              // Description
              "[&>[data-slot=description]]:col-start-1 [&>[data-slot=description]]:row-start-2",
            ],
            layout === "switch-2" && [
              // Base
              "grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1",
              // Control
              "[&>[data-slot=control]]:col-start-1 [&>[data-slot=control]]:self-center",
              // Label
              "[&>[data-slot=label]]:col-start-2 [&>[data-slot=label]]:row-start-1 [&>[data-slot=label]]:justify-self-start",
              // Description
              "[&>[data-slot=description]]:col-start-2 [&>[data-slot=description]]:row-start-2",
            ],
            className,
          )}
          ref={forwardedRef}
          {...props}
        >
          {children}
        </div>
      </FieldContext.Provider>
    );
  },
);

Field.displayName = "Field";

/* -------------------------------------------------------------------------- */
/*                                 FIELD LABEL                                */
/* -------------------------------------------------------------------------- */

export const FieldLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ decorative = false, children, ...props }, forwardedRef) => {
  const { controlId, labelId } = useField();

  return (
    <Label
      id={labelId}
      htmlFor={decorative ? undefined : controlId}
      decorative={decorative}
      ref={forwardedRef}
      {...props}
    >
      {children}
    </Label>
  );
});

FieldLabel.displayName = "FieldLabel";

/* -------------------------------------------------------------------------- */
/*                                FIELD CONTROL                               */
/* -------------------------------------------------------------------------- */

export const FieldControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ children, ...props }, forwardedRef) => {
  const { isInvalid, labelId, controlId, descriptionId, errorMessageId } =
    useField();

  return (
    <Slot
      data-slot="control"
      id={controlId}
      aria-labelledby={labelId}
      aria-describedby={isInvalid ? errorMessageId : descriptionId}
      aria-invalid={isInvalid}
      ref={forwardedRef}
      {...props}
    >
      {children}
    </Slot>
  );
});

FieldControl.displayName = "FieldControl";

/* -------------------------------------------------------------------------- */
/*                              FIELD DESCRIPTION                             */
/* -------------------------------------------------------------------------- */

export const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof Description>
>(({ children, ...props }, forwardedRef) => {
  const { descriptionId } = useField();

  return (
    <Description id={descriptionId} ref={forwardedRef} {...props}>
      {children}
    </Description>
  );
});

FieldDescription.displayName = "FieldDescription";

/* -------------------------------------------------------------------------- */
/*                                 FIELD ERROR                                */
/* -------------------------------------------------------------------------- */

type FieldErrorProps = {
  errors?: string[];
} & React.ComponentPropsWithoutRef<typeof ErrorMessage>;

export const FieldError = React.forwardRef<
  HTMLParagraphElement,
  FieldErrorProps
>(({ errors, children, ...props }, forwardedRef) => {
  const { errorMessageId, setIsInvalid } = useField();

  const content = React.useMemo(() => {
    return Array.isArray(errors) && errors.length > 0 ? errors[0] : children;
  }, [errors, children]);

  React.useEffect(() => {
    if (content) setIsInvalid(true);
    return () => setIsInvalid(false);
  }, [content, setIsInvalid]);

  if (!content) return null;

  return (
    <ErrorMessage id={errorMessageId} ref={forwardedRef} {...props}>
      {content}
    </ErrorMessage>
  );
});

FieldError.displayName = "FieldError";
