import { AppLogo } from "@/components/ui/app-logo";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { NotFoundRoute as NotFoundRouteClass } from "@tanstack/react-router";
import { rootRoute } from "./layout";
import { defaultTaskSearchParams } from "./_require-auth/tasks/page";

export const notFoundRoute = new NotFoundRouteClass({
  getParentRoute: () => rootRoute,
  component: NotFoundPage,
});

export function NotFoundPage() {
  return (
    <div className="h-full flex flex-col justify-center items-center relative">
      <div className="flex flex-col items-center gap-5">
        <AppLogo
          size={1000}
          className="fixed -top-[400px] -right-[400px] opacity-20 -z-10"
        />
        <div className="flex flex-col items-center gap-1">
          <p className="text-foreground text-2xl font-bold">404 Not found</p>
          <p className="text-muted-foreground">ページが存在しません</p>
        </div>
        <Button asChild>
          <Link search={defaultTaskSearchParams} to="/tasks">
            ホームへ戻る
          </Link>
        </Button>
      </div>
    </div>
  );
}
