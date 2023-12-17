import { useState } from "react";
import { api } from "./api";
import { Link } from "@tanstack/react-router";

export const SignupPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState("");

  const handleSignup = async () => {
    await api.post("/signup", { username, profile });
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
        <Link to="/">キャンセル</Link>
        <button onClick={handleSignup}>登録</button>
      </div>
    </div>
  );
};
