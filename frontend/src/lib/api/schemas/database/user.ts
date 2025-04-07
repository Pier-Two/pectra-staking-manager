import { z } from "zod";

export const UserSchema = z.object({
  email: z.string().email(),
});

export type UserType = z.infer<typeof UserSchema>;
