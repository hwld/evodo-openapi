import { useState } from "react";
import { api } from "./api";
import { useNavigate } from "@tanstack/react-router";

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
    <div>
      <h1>新規登録</h1>
      <div className="flex flex-col gap-1">
        <input
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <textarea
          placeholder="プロフィール"
          value={profile}
          onChange={(e) => setProfile(e.target.value)}
        />
      </div>
      <div className="flex gap-1">
        <button onClick={handleCancel}>キャンセル</button>
        <button onClick={handleSignup}>登録</button>
      </div>
    </div>
  );
};
