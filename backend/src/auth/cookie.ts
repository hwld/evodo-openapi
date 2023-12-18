import { CookieOptions } from "hono/utils/cookie";
import { CookieAttributes } from "oslo/cookie";

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
