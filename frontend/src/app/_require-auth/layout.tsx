import { Navigate, Outlet, Route } from "@tanstack/react-router";
import { rootRoute } from "../layout";
import { Sidebar } from "../../components/sidebar/sidebar";
import {
  sessionQueryOptions,
  useSession,
} from "../../features/auth/use-session";

export const requireAuthRoute = new Route({
  id: "requireAuth",
  getParentRoute: () => rootRoute,
  component: RequireAuthLayout,
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData(sessionQueryOptions);
  },
});

function RequireAuthLayout() {
  // beforeLoadでセッションを読み込むとpendingComponentが表示されないのでここでロードする。
  // beforeLoadと違い、RequireAuthLayoutの子Routeのloaderが実行されてしまう。
  // けど、認証が必須のページにある機密性の高いAPIはsession情報がなければエラーを返すと思うので問題ない？
  const { session } = useSession();

  if (!session) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="min-h-min flex">
      <div className="sticky top-0 px-3 py-5 h-[100dvh]">
        <Sidebar session={session} />
      </div>
      <div className="grow flex">
        <Outlet />
      </div>
    </div>
  );
}
