import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  ScrollRestoration,
  rootRouteWithContext,
} from "@tanstack/react-router";

export const rootRoute = rootRouteWithContext()({
  component: RootLayout,
});

export function RootLayout() {
  return (
    <div className="h-[100dvh]">
      <ScrollRestoration />
      <Outlet />
      <Toaster />
    </div>
  );
}
