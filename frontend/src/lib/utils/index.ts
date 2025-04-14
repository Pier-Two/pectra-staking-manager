/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { IResponse } from "pec/types/response";
import { parseError } from "./parseError";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const generateErrorResponse = (
  error: unknown,
  fallbackMessage?: string,
): IResponse => {
  return {
    success: false,
    error: parseError(error, fallbackMessage),
  };
};
