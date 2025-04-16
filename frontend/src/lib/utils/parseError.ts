import axios from "axios";
import type { IError } from "pec/types/response";
import { z } from "zod";

export const parseError = (
  error: unknown,
  fallbackMessage?: string,
): IError => {
  if (error instanceof z.ZodError)
    return error.errors.map((e) => e.message).join(", ");

  if (axios.isAxiosError(error))
    return `${error.response?.status} ${error.response?.statusText}`;

  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (typeof error === "object" && error !== null) return JSON.stringify(error);

  return fallbackMessage ?? "Unknown error";
};
