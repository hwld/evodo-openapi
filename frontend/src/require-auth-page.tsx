import { Navigate, Outlet } from "@tanstack/react-router";
import { useSession } from "./use-session";

export const RequireAuthPage: React.FC = () => {
  const { session, isLoading, isError } = useSession();

  if (isLoading) {
    return <div>loading...</div>;
  }
  if (isError) {
    return <div>error</div>;
  }

  return session ? <Outlet /> : <Navigate to="/auth/login" replace={true} />;
};
