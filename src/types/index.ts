export type ActionResult<T extends object = object> =
  | ({ success: true } & T)
  | { success: false; error: { message: string } };

export type FormSubmissionResult<T, U extends object = object> =
  | ({ success: true } & U)
  | {
      success: false;
      errors: { root?: string[] } & { [K in keyof T]?: string[] };
    };
