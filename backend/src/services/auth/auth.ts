import { Lucia } from "lucia";
import { AppBindings } from "../../app";
import { Google, generateCodeVerifier, generateState } from "arctic";
import { loginCallbackPath } from "../../features/auth/path";
import {
  CODE_VERIFIER_COOKIE,
  LOGIN_SESSION_COOKIE,
  STATE_COOKIE,
} from "../../features/auth/consts";
import { DB } from "../db";
import { Context, HonoRequest } from "hono";
import { LoginSession } from "./login-session";
import { SignupSession } from "./signup-session";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { CookieOptions } from "hono/utils/cookie";
import { HTTPException } from "hono/http-exception";
import { AuthAdapter } from "./adapter";
import { log } from "../logger";
import { defaultCookieOptions } from "../../lib/cookie";

declare module "lucia" {
  interface Register {
    Lucia: AppLucia;
  }
  interface DatabaseUserAttributes {
    name: string;
    profile: string;
    googleId: string;
  }
}

type SessionAttrs = {};
type UserAttrs = { name: string; profile: string };
export type AppLucia = Lucia<SessionAttrs, UserAttrs>;

export class Auth {
  public loginSession: LoginSession;
  public signupSession: SignupSession;

  private lucia: AppLucia;
  private google: Google;

  constructor(
    private context: Context,
    private env: AppBindings,
    private db: DB,
  ) {
    this.lucia = new Lucia(new AuthAdapter(db, env.KV), {
      sessionCookie: {
        name: LOGIN_SESSION_COOKIE,
      },
      getUserAttributes: (data) => {
        return {
          name: data.name,
          profile: data.profile,
        };
      },
    });

    this.google = new Google(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      `${env.BASE_URL}${loginCallbackPath}`,
    );

    this.loginSession = new LoginSession(this.context, this.env, this.lucia);
    this.signupSession = new SignupSession(this.context, this.env, this.db);
  }

  public createAuthUrl = async () => {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    const isProd = this.env.ENVIRONMENT === "prod";
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 10,
      ...defaultCookieOptions(isProd),
    };
    setCookie(this.context, STATE_COOKIE, state, cookieOptions);
    setCookie(this.context, CODE_VERIFIER_COOKIE, codeVerifier, cookieOptions);

    return await this.google.createAuthorizationURL(state, codeVerifier);
  };

  public validateAuthorizationCode = async (req: HonoRequest) => {
    // codeは認可サーバー側で検証し、stateはここで検証する
    const { code, state } = req.query();

    const codeVerifierCookie = getCookie(this.context, CODE_VERIFIER_COOKIE);
    deleteCookie(this.context, CODE_VERIFIER_COOKIE);
    const stateCookie = getCookie(this.context, STATE_COOKIE);
    deleteCookie(this.context, STATE_COOKIE);

    if (
      !codeVerifierCookie ||
      !stateCookie ||
      !code ||
      !state ||
      state !== stateCookie
    ) {
      log.error(
        "必要なパラメータが不足しているか、stateの比較に失敗しました。",
      );
      throw new HTTPException(400, { message: "Bad request" });
    }

    return this.google.validateAuthorizationCode(code, codeVerifierCookie);
  };
}
