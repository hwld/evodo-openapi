import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useSignup } from "../../-hooks/use-signup";

const signupFormSchema = schemas.SignupInput;
type SignupFormData = z.infer<typeof signupFormSchema>;

export const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const signupMutation = useSignup();

  const form = useForm<SignupFormData>({
    defaultValues: { username: "", profile: "" },
    resolver: zodResolver(schemas.SignupInput),
  });

  const handleSignup = form.handleSubmit(async ({ username, profile }) => {
    signupMutation.mutate(
      { username, profile },
      {
        onSettled: async () => {
          await navigate({ to: "/" });
        },
      },
    );
  });

  return (
    <>
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
        <div className="flex gap-3 justify-end">
          <Button onClick={handleSignup} disabled={signupMutation.isPending}>
            登録する
          </Button>
        </div>
      </Form>
    </>
  );
};
