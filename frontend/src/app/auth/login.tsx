import { rootRoute } from "@/app/layout";
import { AppLogo } from "@/components/ui/app-logo";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/ui/google-icon";
import { LOGIN_URL } from "@/lib/login-url";
import { Route } from "@tanstack/react-router";

export const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/auth/login",
  component: LoginPage,
});

export function LoginPage() {
  return (
    <div className="flex h-full justify-center items-center">
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-5">
          <AppLogo
            size={150}
            className="animate-in spin-in-360 duration-3s ease-linear repeat-infinite"
          />
          <p className="text-lg text-muted-foreground">Evodo OpenAPI</p>
        </div>
        <Button className="gap-2" asChild>
          <a href={LOGIN_URL}>
            <GoogleIcon />
            Googleでログイン
          </a>
        </Button>
      </div>
    </div>
  );
}
