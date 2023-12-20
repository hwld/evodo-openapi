import { Lucia } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";
import { RouteEnv } from "../app";
import { Google, generateCodeVerifier, generateState } from "arctic";
import { loginCallbackPath } from "../features/auth/path";
import {
  CODE_VERIFIER_COOKIE,
  LOGIN_SESSION_COOKIE,
  STATE_COOKIE,
} from "../features/auth/consts";
import { DB } from "../db";
import { Context, HonoRequest } from "hono";
import { LoginSession } from "./loginSession";
import { SignupSession } from "./signupSession";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { CookieOptions } from "hono/utils/cookie";
import { HTTPException } from "hono/http-exception";

export const luciaTableNames = {
  user: "users",
  session: "user_sessions",
} as const;

declare module "lucia" {
  interface Register {
    Lucia: AppLucia;
  }
  interface DatabaseUserAttributes {
    name: string;
    profile: string;
    google_id: string;
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
    private context: Context<RouteEnv>,
    private db: DB,
  ) {
    const { user, session } = luciaTableNames;

    this.lucia = new Lucia(new D1Adapter(context.env.DB, { user, session }), {
      sessionCookie: {
        name: LOGIN_SESSION_COOKIE,
        attributes: {
          secure: context.env.ENVIRONMENT === "prod",
        },
      },
      getUserAttributes: (data) => {
        return {
          name: data.name,
          profile: data.profile,
        };
      },
    });

    this.google = new Google(
      context.env.GOOGLE_CLIENT_ID,
      context.env.GOOGLE_CLIENT_SECRET,
      `${context.env.BASE_URL}${loginCallbackPath}`,
    );

    this.loginSession = new LoginSession(this.lucia, this.context);
    this.signupSession = new SignupSession(this.db, this.context);
  }

  public createAuthUrl = async () => {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: this.context.env.ENVIRONMENT === "prod",
      path: "/",
      maxAge: 60 * 10,
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
      console.error(
        "必要なパラメータが不足しているか、stateの比較に失敗しました。",
      );
      throw new HTTPException(400, { message: "Bad request" });
    }

    return this.google.validateAuthorizationCode(code, codeVerifierCookie);
  };
}
