import { z } from "zod";

export const UserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  companyName: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;
