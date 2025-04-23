import { DatabaseDocumentStatuses } from "pec/types/app";
import { z } from "zod";

export const DatabaseDepositSchema = z.object({
  status: z.enum(DatabaseDocumentStatuses),
  validatorIndex: z.number(),
  txHash: z.string(),
  email: z.string().email().optional().or(z.literal("")),
});

export type DatabaseDepositType = z.infer<typeof DatabaseDepositSchema>;
