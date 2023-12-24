import { Navigate, Outlet } from "@tanstack/react-router";
import { useSession } from "../_auth/use-session";

export const RequireAuthLayout: React.FC = () => {
  const { session, isLoading, isError } = useSession();

  if (isLoading) {
    return null;
  }
  if (isError) {
    return <div>error</div>;
  }

  return session ? <Outlet /> : <Navigate to="/auth/login" replace={true} />;
};
