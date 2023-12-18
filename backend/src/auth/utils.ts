//https://github.com/lucia-auth/lucia/blob/625350e1dba70c68a7eb47ec792b768bb7353741/packages/oauth/src/core/oidc.ts

import { SessionCookieAttributesOptions } from "lucia";
import { decodeBase64url } from "oslo/encoding";
import type { CookieAttributes } from "oslo/cookie";
import { CookieOptions } from "hono/utils/cookie";

const decoder = new TextDecoder();
/**
 * 検証を行わないので、信頼できるidTokenにのみ使用する
 * */
export const decodeIdToken = <_Claims extends {}>(
  idToken: string,
): {
  iss: string;
  aud: string;
  exp: number;
} & _Claims => {
  const idTokenParts = idToken.split(".");
  if (idTokenParts.length !== 3) throw new SyntaxError("Invalid ID Token");
  const base64UrlPayload = idTokenParts[1];
  const payload: unknown = JSON.parse(
    decoder.decode(decodeBase64url(base64UrlPayload)),
  );
  if (!payload || typeof payload !== "object") {
    throw new SyntaxError("Invalid ID Token");
  }
  return payload as {
    iss: string;
    aud: string;
    exp: number;
  } & _Claims;
};

export const convertCookieAttr = (
  attributes: CookieAttributes,
): CookieOptions => {
  const sameSite = attributes.sameSite;

  return {
    ...attributes,
    sameSite:
      sameSite === "lax"
        ? "Lax"
        : sameSite === "strict"
          ? "Strict"
          : sameSite === "none"
            ? "None"
            : undefined,
  };
};
