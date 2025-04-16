import { z } from "zod";
import { DatabaseDocumentStatuses } from "pec/types/app";

export const DatabaseConsolidationSchema = z.object({
  email: z.string().email().optional(),
  status: z.enum(DatabaseDocumentStatuses),
  targetValidatorIndex: z.number(),
  sourceTargetValidatorIndex: z.number(),
  txHash: z.string(),
});

export type DatabaseConsolidationType = z.infer<
  typeof DatabaseConsolidationSchema
>;
