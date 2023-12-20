import { Lucia } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";
import { Bindings } from "../app";
import { Google } from "arctic";
import { loginCallbackPath } from "../features/auth/path";
import { LOGIN_SESSION_COOKIE } from "../features/auth/consts";
import { DB } from "../db";
import { Context } from "hono";
import { LoginSession } from "./loginSession";
import { SignupSession } from "./signupSession";

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
  // TODO: Sessionクラスのインターフェースを修正する
  public loginSession: LoginSession;
  public signupSession: SignupSession;

  private lucia: AppLucia;
  private google: Google;

  constructor(
    private context: Context,
    private db: DB,
    env: Bindings,
  ) {
    const { user, session } = luciaTableNames;

    this.lucia = new Lucia(new D1Adapter(env.DB, { user, session }), {
      sessionCookie: {
        name: LOGIN_SESSION_COOKIE,
        attributes: {
          secure: env.ENVIRONMENT === "prod",
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
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      `${env.BASE_URL}${loginCallbackPath}`,
    );

    this.loginSession = new LoginSession(this.lucia, this.context);
    this.signupSession = new SignupSession(this.db, this.context, env);
  }

  public createAuthUrl = async (
    ...args: Parameters<typeof this.google.createAuthorizationURL>
  ) => {
    return this.google.createAuthorizationURL(...args);
  };

  public validateAuthorizationCode = async (
    ...args: Parameters<typeof this.google.validateAuthorizationCode>
  ) => {
    return this.google.validateAuthorizationCode(...args);
  };
}
