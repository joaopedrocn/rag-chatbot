import * as Sonner from "sonner";

/* -------------------------------------------------------------------------- */
/*                                    TOAST                                   */
/* -------------------------------------------------------------------------- */

type ToastOptions = {
  id?: string | number;
  type?: "default" | "loading" | "success" | "error";
};

export const toast = (message: string, options: ToastOptions = {}) => {
  switch (options.type) {
    case "loading":
      return Sonner.toast.loading(message, {
        id: options.id,
        dismissible: false,
      });
    case "success":
      return Sonner.toast.success(message, {
        id: options.id,
        dismissible: false,
      });
    case "error":
      return Sonner.toast.error(message, {
        id: options.id,
        dismissible: false,
      });
    default:
      return Sonner.toast(message, {
        id: options.id,
        dismissible: false,
      });
  }
};

/* -------------------------------------------------------------------------- */
/*                                DISMISS TOAST                               */
/* -------------------------------------------------------------------------- */

export const dismissToast = (toastId?: string | number) => {
  return Sonner.toast.dismiss(toastId);
};
