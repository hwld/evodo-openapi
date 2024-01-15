import { Route, redirect, useNavigate } from "@tanstack/react-router";
import { api } from "../../api";
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/ui/app-logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignupForm } from "../../features/auth/signup-form/signup-form";
import { rootRoute } from "@/app/layout";

export const signupRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/auth/signup",
  beforeLoad: async () => {
    const { exists } = await api.get("/signup-session");
    if (!exists) {
      throw redirect({ to: "/", replace: true });
    }
  },
  component: SignupPage,
});

export function SignupPage() {
  const navigate = useNavigate();

  const handleCancel = async () => {
    try {
      await api.post("/signup/cancel", undefined);
    } finally {
      await navigate({ to: "/" });
    }
  };

  return (
    <div className="flex flex-col h-full justify-center items-center">
      <div className="space-y-3">
        <Card className="w-[500px] relative">
          <AppLogo
            size={75}
            className="absolute bottom-[105%] left-0 right-0 m-auto"
          />
          <CardHeader>
            <CardTitle>ユーザーを登録する</CardTitle>
            <CardDescription>
              はじめまして。evodoへようこそ。
              <br />
              必要な情報を記入して、タスクの管理を始めましょう。
              <br />
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <SignupForm />
          </CardContent>
          <Button
            className="absolute top-[103%]"
            variant="link"
            onClick={handleCancel}
          >
            ユーザーの登録をやめる
          </Button>
        </Card>
      </div>
    </div>
  );
}
