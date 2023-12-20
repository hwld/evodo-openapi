import * as cookieParser from "set-cookie-parser";

export const parseSetCookie = (cookie: string) => {
  return cookieParser.parse(cookieParser.splitCookiesString(cookie), {
    map: true,
  });
};
