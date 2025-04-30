import { DatabaseDocumentStatuses } from "pec/types/app";
import { z } from "zod";
import { EmailSchema } from "../email";

export const DatabaseDepositSchema = z.object({
  status: z.enum(DatabaseDocumentStatuses),
  validatorIndex: z.number(),
  txHash: z.string(),
  email: EmailSchema,
});

export type DatabaseDepositType = z.infer<typeof DatabaseDepositSchema>;
