import { Inter } from "next/font/google";
import { Toaster as SonnerToaster } from "sonner";
import { LoaderIcon } from "./icons/loader";
import { CheckCircleIcon } from "./icons/check-circle";
import { XCircleIcon } from "./icons/x-circle";

const inter = Inter({ subsets: ["latin"] });

export const Toaster = () => {
  return (
    <SonnerToaster
      duration={5000}
      gap={12}
      containerAriaLabel="Notificações"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: `${inter.className} pointer-events-auto flex w-full items-center gap-x-3 rounded-lg bg-white px-5 py-4 shadow-lg ring-1 ring-zinc-950/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:bg-zinc-800 dark:ring-inset dark:ring-white/10`,
          title: "text-sm font-medium text-zinc-900 dark:text-white",
          description: "text-sm text-zinc-600 dark:text-zinc-300",
          icon: "!mx-0",
        },
      }}
      icons={{
        loading: (
          <LoaderIcon className="!mx-0 animate-spin text-zinc-600 dark:text-zinc-300" />
        ),
        success: (
          <CheckCircleIcon className="!mx-0 text-green-600 dark:text-green-500" />
        ),
        error: <XCircleIcon className="!mx-0 text-red-600 dark:text-red-500" />,
      }}
    />
  );
};
