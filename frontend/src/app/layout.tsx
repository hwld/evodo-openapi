import { Outlet } from "@tanstack/react-router";

export const RootLayout: React.FC = () => {
  return (
    <div className="h-[100dvh] bg-gray-200 text-gray-700 p-5">
      <Outlet />
    </div>
  );
};
