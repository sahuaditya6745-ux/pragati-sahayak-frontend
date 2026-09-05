import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="top-right"
      duration={3000}
      richColors
      className="toaster group"
      toastOptions={{
        duration: 3000,
        classNames: {
          toast:
            "group toast font-sans group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl p-4 border",
          success:
            "!bg-emerald-500/10 !border-emerald-500/40 !text-emerald-800 dark:!text-emerald-300 font-medium",
          error:
            "!bg-red-500/10 !border-red-500/40 !text-red-800 dark:!text-red-300 font-medium",
          warning:
            "!bg-amber-500/10 !border-amber-500/40 !text-amber-800 dark:!text-amber-300 font-medium",
          info:
            "!bg-blue-500/10 !border-blue-500/40 !text-blue-800 dark:!text-blue-300 font-medium",
          description: "group-[.toast]:text-muted-foreground text-xs mt-1",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground text-xs font-bold",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground text-xs",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
