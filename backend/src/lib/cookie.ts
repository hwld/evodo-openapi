import { CookieOptions } from "hono/utils/cookie";
import { CookieAttributes } from "oslo/cookie";
import * as cookieParser from "set-cookie-parser";

export const parseSetCookie = (cookie: string) => {
  return cookieParser.parse(cookieParser.splitCookiesString(cookie), {
    map: true,
  });
};

// フロントエンドとバックエンドのドメインが異なるので、クロスサイトのcookieを許可する。
export const defaultCookieOptions = (isProd: boolean) => {
  if (isProd) {
    return { secure: true, sameSite: "None" } as const;
  }
  return { secure: false } as const;
};

// luciaのOptionsをhonoのOptionsに変換する
export const convertToOptions = (
  attributes: CookieAttributes,
): CookieOptions => {
  const sameSite = attributes.sameSite;
  const map = { lax: "Lax", strict: "Strict", none: "None" } as const;

  return {
    ...attributes,
    sameSite: sameSite && map[sameSite],
  };
};
