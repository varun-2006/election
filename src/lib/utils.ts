import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const houses: [string, ...string[]] = [
  "ETON",
  "LEEDS",
  "OXFORD",
  "HARROW",
];
export const sections: [string, ...string[]] = ["A", "B", "C", "D", "E", "F"];
export const standards = ["5", "6", "7", "8", "9", "10"];
