import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

/**
 * 現在の日本の日付時刻
 */
export const currentDateTime = () => {
  return formatDateTime(new Date());
};

export const formatDateTime = (date: Date) => {
  const zoned = utcToZonedTime(date, "Asia/Tokyo");
  return format(zoned, "yyyy/MM/dd HH:mm:ss");
};
