import { z } from "zod";
import { DatabaseDocumentStatuses } from "pec/types/app";

export const DatabaseWithdrawalSchema = z.object({
  status: z.enum(DatabaseDocumentStatuses),
  validatorIndex: z.number(),
  withdrawalIndex: z.number().nullable(),
  amount: z.number(),
  txHash: z.string(),
  email: z.string().email().optional(),
});

export type DatabaseWithdrawalType = z.infer<typeof DatabaseWithdrawalSchema>;
