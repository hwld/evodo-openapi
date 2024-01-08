import { renderWithRouter } from "@/tests/provider";
import { createTestRouter } from "@/tests/router";
import { screen, waitFor } from "@testing-library/react";
import { SignupForm } from "./signup-form";
import { createHashHistory } from "@tanstack/react-router";
import userEvent from "@testing-library/user-event";
import { createPostHandler, setupMockServer } from "@/tests/msw";
import { vi } from "vitest";
import { HttpResponse } from "msw";

const user = userEvent.setup();

const setup = async () => {
  const history = createHashHistory();
  const router = createTestRouter(SignupForm, history);

  const getUsernameField = () =>
    screen.getByRole("textbox", { name: "ユーザー名" });

  const getProfileField = () =>
    screen.getByRole("textbox", { name: "プロフィール" });

  const getSignupButton = () =>
    screen.getByRole("button", { name: "登録する" });

  const typeUsername = async (username: string) => {
    await user.type(getUsernameField(), username);
  };

  const typeProfile = async (profile: string) => {
    await user.type(getProfileField(), profile);
  };

  const clickSignup = async () => {
    await user.click(getSignupButton());
  };

  renderWithRouter(router);

  // tanstack-routerではwaitForで待つ必要がある
  await waitFor(() => {
    expect(getUsernameField()).toBeInTheDocument();
    expect(getSignupButton()).toBeInTheDocument();
    expect(getProfileField()).toBeInTheDocument();
  });

  return {
    history,
    router,
    getUsernameField,
    getSignupButton,
    typeUsername,
    typeProfile,
    clickSignup,
  };
};

const server = setupMockServer();

describe("新規登録フォーム", () => {
  it("ユーザー名が未入力の場合には登録が行われない", async () => {
    const signupHandler = vi.fn();
    server.use(createPostHandler("/signup", signupHandler));

    const { getUsernameField, clickSignup } = await setup();

    await clickSignup();

    await waitFor(() => {
      expect(getUsernameField()).toBeInvalid();
    });
    // i18nextを使用してzodのi18nを行っているのだが、テスト環境で動かないのでとりあえずエラーメッセージが表示されてることだけ
    // 確認する
    expect(getUsernameField()).toHaveAccessibleErrorMessage(/.*/);
    expect(signupHandler).not.toHaveBeenCalled();
  });

  it("ユーザー名とプロフィールが入力されていると登録が行われる", async () => {
    type Data = { username: string; profile: string };

    const newUser: Data = { username: "username", profile: "profile" };
    let receivedUser: Data;
    server.use(
      createPostHandler("/signup", async ({ request }) => {
        receivedUser = await request.json();
        return HttpResponse.json({ userId: "user" });
      }),
    );

    const { typeUsername, typeProfile, clickSignup } = await setup();

    await typeUsername(newUser.username);
    await typeProfile(newUser.profile);
    await clickSignup();

    await waitFor(() => {
      expect(receivedUser).toMatchObject(newUser);
    });
  });

  it("新規登録の実行中は、登録ボタンが無効になっている", async () => {
    server.use(
      createPostHandler("/signup", async () => {
        await new Promise((r) => setTimeout(() => r(undefined), 0));
        return HttpResponse.json({ userId: "user" });
      }),
    );

    const { getSignupButton, typeProfile, typeUsername, clickSignup } =
      await setup();

    await typeUsername("username");
    await typeProfile("profile");
    await clickSignup();

    // disabledになったあと、すぐにdisabledが解除されることを期待する
    // signupのhandlerのsetTimeoutを長くすると、not.toBeDisabledのwaitForの待機時間が長くなる
    await waitFor(() => {
      expect(getSignupButton()).toBeDisabled();
    });
    await waitFor(() => {
      expect(getSignupButton()).not.toBeDisabled();
    });
  });
});
