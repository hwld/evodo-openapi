import { Route, redirect, useNavigate } from "@tanstack/react-router";
import { api } from "../../../api";
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/ui/app-logo";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemas } from "@/api/schema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
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

const signupFormSchema = schemas.SignupInput;
type SignupFormData = z.infer<typeof signupFormSchema>;

export function SignupPage() {
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: (data: SignupFormData) => {
      return api.post("/signup", {
        username: data.username,
        profile: data.profile,
      });
    },
    onSuccess: async () => {
      await navigate({ to: "/" });
    },
    onError: async () => {
      toast.error("ユーザーを作成できませんでした。");
      await navigate({ to: "/" });
    },
  });
  const form = useForm<SignupFormData>({
    defaultValues: { username: "", profile: "" },
    resolver: zodResolver(schemas.SignupInput),
  });

  const handleSignup = form.handleSubmit(async ({ username, profile }) => {
    mutate({ username, profile });
  });

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
          <motion.div
            className="absolute bottom-[105%] left-0 right-0 m-auto w-fit"
            animate={{ scale: [1, 1.1, 1], rotate: [0, -10, 0] }}
            transition={{ repeat: Infinity }}
          >
            <AppLogo size={75} />
          </motion.div>
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
            <Form {...form}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <div className="flex items-end justify-between h-5">
                        <FormLabel>ユーザー名</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          error={!!form.formState.errors.username}
                          placeholder="username..."
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="profile"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <div className="flex items-end justify-between h-5">
                        <FormLabel>プロフィール</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Textarea
                          rows={5}
                          placeholder="profile..."
                          className="resize-none"
                          error={!!form.formState.errors.profile}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
            </Form>
            <div className="flex gap-3 justify-end">
              <Button onClick={handleSignup}>登録する</Button>
            </div>
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
