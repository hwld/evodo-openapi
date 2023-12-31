import { type ClassValue, clsx } from "clsx";
import { SyntheticEvent } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const stopPropagation = (e: SyntheticEvent) => {
  e.stopPropagation();
};
