import { z } from "zod";
import { Types } from "mongoose";
import { UserSchema } from "./user";
import { DatabaseDocumentStatuses } from "pec/types/app";

export const DatabaseWithdrawalSchema = z.object({
  user: z.instanceof(Types.ObjectId).or(UserSchema),
  status: z.enum(DatabaseDocumentStatuses),
  validatorIndex: z.number(),
  withdrawalIndex: z.number().nullable(),
});

export type DatabaseWithdrawalType = z.infer<typeof DatabaseWithdrawalSchema>;
