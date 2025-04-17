import { z } from "zod";
import { DatabaseDocumentStatuses } from "pec/types/app";

export const DatabaseDepositSchema = z.object({
  status: z.enum(DatabaseDocumentStatuses),
  validatorIndex: z.number(),
  txHash: z.string(),
  email: z.string().email().optional(),
});

export type DatabaseDepositType = z.infer<typeof DatabaseDepositSchema>;
