import { Lucia } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";
import { Bindings } from "../app";
import { Google } from "arctic";
import { loginCallbackPath } from "../features/auth/path";
import { LOGIN_SESSION_COOKIE } from "../features/auth/consts";

export const luciaTableNames = {
  user: "users",
  session: "user_sessions",
} as const;

export const initializeLucia = (db: D1Database, env: Bindings) => {
  const { user, session } = luciaTableNames;

  const auth = new Lucia(new D1Adapter(db, { user, session }), {
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

  const googleAuth = new Google(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    `${env.BASE_URL}${loginCallbackPath}`,
  );

  return { auth, googleAuth };
};

export type LuciaAuth = ReturnType<typeof initializeLucia>["auth"];
export type GoogleAuth = ReturnType<typeof initializeLucia>["googleAuth"];

declare module "lucia" {
  interface Register {
    Lucia: LuciaAuth;
  }
  interface DatabaseUserAttributes {
    name: string;
    profile: string;
    google_id: string;
  }
}
