import { lucia } from "lucia";
import { hono } from "lucia/middleware";
import { d1 } from "@lucia-auth/adapter-sqlite";
import { Bindings } from "../app";
import { google } from "@lucia-auth/oauth/providers";
import { loginCallbackPath } from "../features/auth/path";

export const luciaTableNames = {
  user: "users",
  key: "user_keys",
  session: "user_sessions",
} as const;

export const initializeLucia = (db: D1Database, bindnigs: Bindings) => {
  const { user, key, session } = luciaTableNames;
  const auth = lucia({
    csrfProtection: bindnigs.ENVIRONMENT === "prod" ? true : false,
    env: bindnigs.ENVIRONMENT === "prod" ? "PROD" : "DEV",
    middleware: hono(),
    adapter: d1(db, {
      user,
      key,
      session,
    }),
    getUserAttributes: (data) => {
      return {
        name: data.name,
      };
    },
  });

  const googleAuth = google(auth, {
    clientId: bindnigs.GOOGLE_CLIENT_ID,
    clientSecret: bindnigs.GOOGLE_CLIENT_SECRET,
    redirectUri: `${bindnigs.BASE_URL}${loginCallbackPath}`,
  });

  return { auth, googleAuth };
};

export type Auth = ReturnType<typeof initializeLucia>["auth"];
export type GoogleAuth = ReturnType<typeof initializeLucia>["googleAuth"];
