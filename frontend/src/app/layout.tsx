import { Toaster } from "@/components/ui/sonner";
import { Outlet, ScrollRestoration } from "@tanstack/react-router";

export const RootLayout: React.FC = () => {
  return (
    <div className="h-[100dvh]">
      <ScrollRestoration />
      <Outlet />
      <Toaster />
    </div>
  );
};
