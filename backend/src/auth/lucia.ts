import { Lucia } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";
import { Bindings } from "../app";
import { Google } from "arctic";
import { loginCallbackPath } from "../features/auth/path";
import { LOGIN_SESSION_COOKIE } from "../features/auth/consts";
import { DB } from "../db";
import { Context } from "hono";

export const luciaTableNames = {
  user: "users",
  session: "user_sessions",
} as const;

declare module "lucia" {
  interface Register {
    // Authを渡すとUserAttrsをinferできないっぽくて補完が動かないので・・・
    Lucia: Lucia<SessionAttrs, UserAttrs>;
  }
  interface DatabaseUserAttributes {
    name: string;
    profile: string;
    google_id: string;
  }
}

type SessionAttrs = {};
type UserAttrs = { name: string; profile: string };
export class Auth extends Lucia<SessionAttrs, UserAttrs> {
  public google: Google;
  private honoContext: Context;
  private db: DB;

  constructor(context: Context, env: Bindings, db: DB) {
    const { user, session } = luciaTableNames;

    super(new D1Adapter(env.DB, { user, session }), {
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

    this.db = db;
    this.honoContext = context;
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
