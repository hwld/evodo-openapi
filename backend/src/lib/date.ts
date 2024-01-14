import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";

/**
 * 現在の日本の日付時刻
 */
export const currentDateTime = () => {
  return formatDateTime(new Date());
};

export const formatDateTime = (date: Date) => {
  return format(date, "yyyy/MM/dd HH:mm:ss", { locale: ja });
};
