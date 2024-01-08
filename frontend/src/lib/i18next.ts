import i18next from "i18next";
import { z } from "zod";
import translation from "zod-i18n-map/locales/ja/zod.json";
import { zodI18nMap } from "zod-i18n-map";

export const setupI18Next = () => {
  i18next.init({
    lng: "ja",
    resources: {
      ja: { zod: translation },
    },
  });
  z.setErrorMap(zodI18nMap);
};
