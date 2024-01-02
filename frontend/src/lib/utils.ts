import { type ClassValue, clsx } from "clsx";
import { SyntheticEvent } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const stopPropagation = (e: SyntheticEvent) => {
  e.stopPropagation();
};

/**
 * 文字列を文字列の配列に変換する
 */
export const transformStringToArray = <T extends string>(
  v: T | T[] | undefined,
): T[] | undefined => {
  if (typeof v === "string") {
    return [v];
  }
  return v;
};
