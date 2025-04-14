import { z } from "zod";
import { Types } from "mongoose";
import { UserSchema } from "./user";
import { DatabaseDocumentStatuses } from "pec/types/app";

export const DatabaseConsolidationSchema = z.object({
  user: z.instanceof(Types.ObjectId).or(UserSchema),
  status: z.enum(DatabaseDocumentStatuses),
  targetValidatorIndex: z.number(),
  sourceTargetValidatorIndex: z.number(),
  txHash: z.string(),
});

export type DatabaseConsolidationType = z.infer<
  typeof DatabaseConsolidationSchema
>;
