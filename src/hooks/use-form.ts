import * as React from "react";
import { z } from "zod";
import { isEqual } from "@/utils/is-equal";

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

export type FieldValues = { [k: string]: any };

type Partial<T> = { [P in keyof T]: T[P] | undefined };

export type DefaultValues<FormData extends FieldValues> = Partial<FormData>;

export type Values<FormData extends FieldValues> = Partial<FormData>;

export type ErrorsDirectory<FormData extends FieldValues> = {
  [P in keyof FormData]?: string[];
} & { root?: string[] };

export type DirtyFieldsDirectory<FormData extends FieldValues> = {
  [P in keyof FormData]?: boolean;
};

export type FieldRefsDirectory<FormData extends FieldValues> = {
  [P in keyof FormData]?: any;
};

export type SetValueFn<FormData extends FieldValues> = <
  K extends keyof FormData,
>(
  key: K,
  value: FormData[K] | undefined,
) => void;

export type SetErrorsFn<FormData extends FieldValues> = <
  K extends keyof FormData | "root",
>(
  arg1: K | ErrorsDirectory<FormData>,
  arg2?: string[],
) => void;

export type SetFieldRefFn<FormData extends FieldValues> = <
  K extends keyof FormData,
>(
  key: K,
) => (ref: any) => void;

export type GetFieldRefFn<FormData extends FieldValues> = <
  K extends keyof FormData,
>(
  key: K,
) => any;

export type HandleSubmitFn<FormData extends FieldValues> = (
  onSubmit: (data: FormData) => Promise<void> | void,
) => (e: React.FormEvent<HTMLFormElement>) => void;

export type SetFocusFn<FormData extends FieldValues> = (
  key: keyof FormData,
) => void;

export type ResetFn<FormData extends FieldValues> = (
  newDefaultValues?: DefaultValues<FormData>,
) => void;

/* -------------------------------------------------------------------------- */
/*                                    UTILS                                   */
/* -------------------------------------------------------------------------- */

const validate = <FormData extends FieldValues>(
  data: unknown,
  schema: z.Schema<FormData>,
):
  | { success: true; data: FormData }
  | { success: false; errors: ErrorsDirectory<FormData> } => {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const { formErrors, fieldErrors } = result.error.flatten();
    return { success: false, errors: { root: formErrors, ...fieldErrors } };
  }
};

const hasFocusMethod = (
  obj: unknown,
): obj is { focus: (...args: unknown[]) => unknown; [k: string]: unknown } => {
  return z.object({ focus: z.function() }).safeParse(obj).success;
};

const normalizeErrors = <FormData extends FieldValues>(
  errorsDirectory: ErrorsDirectory<FormData>,
): ErrorsDirectory<FormData> => {
  return Object.fromEntries(
    Object.entries(errorsDirectory).map(([key, errors]) => [
      key,
      Array.isArray(errors) && errors.length > 0 ? errors : undefined,
    ]),
  ) as ErrorsDirectory<FormData>;
};

/* -------------------------------------------------------------------------- */
/*                                    HOOK                                    */
/* -------------------------------------------------------------------------- */

type UseFormOptions<FormData extends FieldValues> = {
  schema: z.Schema<FormData>;
  defaultValues: DefaultValues<FormData>;
  disabled?: boolean;
};

export const useForm = <FormData extends FieldValues>({
  schema,
  defaultValues,
  disabled: isDisabled = false,
}: UseFormOptions<FormData>) => {
  const defaultValuesRef = React.useRef<DefaultValues<FormData>>(defaultValues);

  const [data, setData] = React.useState<Values<FormData>>(defaultValues);

  const [errorsDirectory, setErrorsDirectory] = React.useState<
    ErrorsDirectory<FormData>
  >({});

  const isValid = React.useMemo(() => {
    return !Object.values(errorsDirectory).some(Boolean);
  }, [errorsDirectory]);

  const [dirtyFieldsDirectory, setDirtyFieldsDirectory] = React.useState<
    DirtyFieldsDirectory<FormData>
  >({});

  const isDirty = React.useMemo(() => {
    return Object.values(dirtyFieldsDirectory).some(Boolean);
  }, [dirtyFieldsDirectory]);

  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fieldRefs = React.useRef<FieldRefsDirectory<FormData>>({});

  /* -------- Updates the dirty fields directory when the data changes -------- */

  React.useEffect(() => {
    const dirtyFields: DirtyFieldsDirectory<FormData> = {};

    const defaultValues = defaultValuesRef.current;

    for (const key in data) {
      const isDirty = !isEqual(data[key], defaultValues[key]);
      dirtyFields[key] = isDirty || undefined;
    }

    setDirtyFieldsDirectory(dirtyFields);
  }, [data]);

  /* ---------------- Validates the form when the data changes ---------------- */

  const shouldValidateRef = React.useRef(true);

  React.useEffect(() => {
    const shouldValidate = shouldValidateRef.current;

    if (!isSubmitted || !shouldValidate) return;

    const result = validate(data, schema);

    if (result.success) {
      setErrorsDirectory({});
    } else {
      setErrorsDirectory(normalizeErrors(result.errors));
    }
  }, [isSubmitted, data, schema]);

  /* -------- Focuses on the first invalid field when there are errors -------- */

  const shouldFocusOnFirstInvalidFieldRef = React.useRef(false);

  React.useEffect(() => {
    const shouldFocus = shouldFocusOnFirstInvalidFieldRef.current;

    if (!shouldFocus) return;

    const firstInvalidField = Object.entries(fieldRefs.current).find(
      ([key, ref]) => {
        const fieldErrors = errorsDirectory[key];
        const isInvalid = Array.isArray(fieldErrors) && fieldErrors.length > 0;
        const refIsSet = !!ref;
        return isInvalid && refIsSet;
      },
    )?.[1];

    if (hasFocusMethod(firstInvalidField)) {
      firstInvalidField.focus();
    }

    shouldFocusOnFirstInvalidFieldRef.current = false;
  }, [errorsDirectory]);

  /* ---------------------------- Sets a field ref ---------------------------- */

  const setFieldRef = React.useCallback<SetFieldRefFn<FormData>>(
    (key) => (ref) => {
      fieldRefs.current[key] = ref;
    },
    [],
  );

  /* ---------------------------- Gets a field ref ---------------------------- */

  const getFieldRef = React.useCallback<GetFieldRefFn<FormData>>((key) => {
    return fieldRefs.current[key];
  }, []);

  /* ------------------------ Sets the value of a field ----------------------- */

  const setValue = React.useCallback<SetValueFn<FormData>>(
    (key, value) => {
      if (isDisabled) return;
      shouldValidateRef.current = true;
      setData((data) => ({ ...data, [key]: value }));
    },
    [isDisabled],
  );

  /* -------------------- Sets many or a single field error ------------------- */

  const setErrors = React.useCallback<SetErrorsFn<FormData>>((arg1, arg2) => {
    if (typeof arg1 === "string") {
      const key = arg1;
      const errors = arg2;
      setErrorsDirectory((prev) => {
        const errorsDirectory = { ...prev, [key]: errors };
        return normalizeErrors(errorsDirectory);
      });
    } else {
      const errorsDirectory = arg1 as ErrorsDirectory<FormData>;
      shouldFocusOnFirstInvalidFieldRef.current = true;
      setErrorsDirectory(normalizeErrors(errorsDirectory));
    }
  }, []);

  /* ----------------------- Handles the form submission ---------------------- */

  const handleSubmit = React.useCallback<HandleSubmitFn<FormData>>(
    (onSubmit) => {
      return async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isDisabled) return;

        shouldValidateRef.current = false;

        setIsSubmitted(true);

        const result = validate(data, schema);

        if (result.success) {
          setErrorsDirectory({});
          setIsSubmitting(true);
          await onSubmit?.(result.data);
          setIsSubmitting(false);
        } else {
          shouldFocusOnFirstInvalidFieldRef.current = true;
          setErrorsDirectory(normalizeErrors(result.errors));
        }
      };
    },
    [isDisabled, data, schema],
  );

  /* ------------------------ Sets the focus on a field ----------------------- */

  const setFocus = React.useCallback<SetFocusFn<FormData>>((key) => {
    const ref = fieldRefs.current[key];
    if (hasFocusMethod(ref)) {
      ref.focus();
    }
  }, []);

  /* ----------------------------- Resets the form ---------------------------- */

  const reset = React.useCallback<ResetFn<FormData>>((newDefaultValues) => {
    if (newDefaultValues) {
      defaultValuesRef.current = newDefaultValues;
      setData(newDefaultValues);
    } else {
      setData(defaultValuesRef.current);
    }
    setErrorsDirectory({});
    setDirtyFieldsDirectory({});
    setIsSubmitted(false);
    setIsSubmitting(false);
  }, []);

  return {
    values: data,
    formState: {
      errors: errorsDirectory,
      dirtyFields: dirtyFieldsDirectory,
      isSubmitted,
      isSubmitting,
      isDirty,
      isValid,
      isDisabled,
    },
    refs: {
      set: setFieldRef,
      get: getFieldRef,
    },
    setValue,
    setErrors,
    handleSubmit,
    setFocus,
    reset,
  };
};
