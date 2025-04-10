import { z } from "zod";

export const UserSchema = z.object({
  email: z.string().email(),
  address: z.string(),
});

export type UserType = z.infer<typeof UserSchema>;
