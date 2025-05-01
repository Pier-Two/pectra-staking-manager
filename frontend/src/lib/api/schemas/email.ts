import { z } from "zod";

export const EmailSchema = z.string().email().optional().or(z.literal(""));
