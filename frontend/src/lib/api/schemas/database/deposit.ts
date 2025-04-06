import { z } from "zod";
import { Types } from "mongoose";
import { UserSchema } from "./user";
import { DatabaseDocumentStatuses } from "pec/types/app";

export const DatabaseDepositSchema = z.object({
  user: z.instanceof(Types.ObjectId).or(UserSchema),
  status: z.enum(DatabaseDocumentStatuses),
  validatorIndex: z.number(),
  txHash: z.string(),
});

export type DatabaseDepositType = z.infer<typeof DatabaseDepositSchema>;
