import { DatabaseDocumentStatuses } from "pec/types/app";
import { z } from "zod";

export const DatabaseWithdrawalSchema = z.object({
  status: z.enum(DatabaseDocumentStatuses),
  validatorIndex: z.number(),
  withdrawalIndex: z.number().nullable(),
  amount: z.number(),
  txHash: z.string(),
  email: z.string().email().optional().or(z.literal("")),
});

export type DatabaseWithdrawalType = z.infer<typeof DatabaseWithdrawalSchema>;
