import { z } from "zod";

export const UserSchema = z.object({
  address: z.string(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  companyName: z.string().optional(),
});

export type UserType = z.infer<typeof UserSchema>;
