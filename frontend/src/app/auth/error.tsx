import { Button } from "@/components/ui/button";
import { Link, Route } from "@tanstack/react-router";
import { rootRoute } from "../layout";

export const authErrorRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/auth/error",
  component: AuthErrorPage,
});

export function AuthErrorPage() {
  return (
    <div className="flex h-full justify-center items-center">
      <div className="flex flex-col items-center gap-5">
        <p className="text-2xl font-bold">認証エラー</p>
        <div className="flex flex-col items-center text-muted-foreground gap-1">
          <p>認証に失敗しました。</p>
          <p>もう一度ログインを試してみてください。</p>
        </div>
        <Button asChild>
          <Link to="/">ホームに戻る</Link>
        </Button>
      </div>
    </div>
  );
}
