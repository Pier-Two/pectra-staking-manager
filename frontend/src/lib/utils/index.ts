/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { IResponse } from "pec/types/response";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const generateErrorResponse = (error: unknown): IResponse => {
  return {
    success: false,
    message:
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "An unexpected error occurred",
  };
};
