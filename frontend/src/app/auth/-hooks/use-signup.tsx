import { api } from "@/api";
import { schemas } from "@/api/schema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: z.infer<typeof schemas.SignupInput>) => {
      return api.post("/signup", {
        username: data.username,
        profile: data.profile,
      });
    },
    onError: async () => {
      toast.error("ユーザーを作成できませんでした。");
    },
  });
};
