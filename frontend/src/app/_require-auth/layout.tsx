import { Navigate, Outlet, Route } from "@tanstack/react-router";
import { rootRoute } from "../layout";
import { Sidebar } from "./-sidebar/sidebar";
import { useSession } from "../auth/-hooks/use-session";

export const requireAuthRoute = new Route({
  id: "requireAuth",
  getParentRoute: () => rootRoute,
  component: RequireAuthLayout,
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
    <div className="min-h-min flex h-full">
      <div className="sticky top-0 px-3 py-5 h-[100dvh]">
        <Sidebar session={session} />
      </div>
      <Outlet />
    </div>
  );
}
