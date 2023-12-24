import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { api } from "../../../api";
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/ui/app-logo";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState("");

  const handleSignup = async () => {
    await api.post("/signup", { username, profile });
    await navigate({ to: "/" });
  };

  const handleCancel = async () => {
    await api.post("/signup/cancel", undefined);
    await navigate({ to: "/" });
  };

  return (
    <div className="flex flex-col h-full justify-center items-center gap-8">
      <AppLogo size={75} />
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>ユーザーの登録</CardTitle>
          <CardDescription>
            必要な情報を記入して登録を行うと、このユーザーとしてログインできるようになります。
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Label>ユーザー名</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username..."
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label>プロフィール</Label>
              <Textarea
                placeholder="profile..."
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                className="resize-none"
                rows={5}
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              キャンセル
            </Button>
            <Button onClick={handleSignup}>登録する</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
