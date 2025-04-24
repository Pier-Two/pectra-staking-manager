import { DatabaseDocumentStatuses } from "pec/types/app";
import { z } from "zod";
import { EmailSchema } from "../email";

export const DatabaseWithdrawalSchema = z.object({
  status: z.enum(DatabaseDocumentStatuses),
  validatorIndex: z.number(),
  withdrawalIndex: z.number().nullable(),
  amount: z.number(),
  txHash: z.string(),
  email: EmailSchema,
});

export type DatabaseWithdrawalType = z.infer<typeof DatabaseWithdrawalSchema>;
