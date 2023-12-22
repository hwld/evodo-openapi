import { testClient } from "hono/testing";
import { login } from "./login";
import { testD1, testKv } from "../../../../setup-jest";
import { CODE_VERIFIER_COOKIE, STATE_COOKIE } from "../consts";
import { parseSetCookie } from "../../../lib/cookie";

const client = () => testClient(login, { DB: testD1, KV: testKv });

describe("ログイン", () => {
  it("GoogleログインのためのリダイレクトURLが返される", async () => {
    const authorizationUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    const result = await client().login.google.$get();

    expect(result.status).toBe(302);

    const location = result.headers.get("location");
    expect(location?.startsWith(authorizationUrl)).toBe(true);

    const cookie = parseSetCookie(result.headers.get("set-cookie") ?? "");
    expect(cookie[STATE_COOKIE].value).toBeTruthy();
    expect(cookie[CODE_VERIFIER_COOKIE].value).toBeTruthy();
  });
});
