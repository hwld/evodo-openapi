import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

type ToastClasses = NonNullable<ToasterProps["toastOptions"]>["classNames"];
const Toaster = ({ ...props }: ToasterProps) => {
  // 補完が効かないので変数に移す
  const classNames = {
    toast:
      "cursor-pointer select-none group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
    description: "group-[.toast]:text-muted-foreground",
    actionButton:
      "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
    cancelButton:
      "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
    error: "[&>div[data-icon]]:text-destructive",
    success: "[&>div[data-icon]]:text-success",
  } as ToastClasses;

  return (
    <Sonner
      className="toaster group"
      toastOptions={{ classNames }}
      {...props}
    />
  );
};

export { Toaster };
