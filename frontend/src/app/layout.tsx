import { Outlet } from "@tanstack/react-router";

export const RootLayout: React.FC = () => {
  return (
    <div className="h-[100dvh]">
      <Outlet />
    </div>
  );
};
