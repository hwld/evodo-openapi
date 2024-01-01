import { useEffect, useState } from "react";

/**
 * 一定時間後にtrueになる値を返す
 * @param ms ミリ秒
 * @returns
 */
export const useTimer = (ms: number) => {
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFlag(true), ms);
    return () => clearTimeout(timer);
  }, [flag, ms]);

  return flag;
};
