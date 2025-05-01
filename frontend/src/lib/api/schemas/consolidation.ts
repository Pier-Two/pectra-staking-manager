import { z } from "zod";
import { SupportedChainIdSchema } from "./network";
import { EmailSchema } from "./email";

export const StoreConsolidationSchema = z.object({
  targetValidatorIndex: z.number(),
  sourceValidatorIndex: z.number(),
  txHash: z.string(),
  email: EmailSchema,
  network: SupportedChainIdSchema,
  amount: z.number(),
});

export type StoreConsolidationType = z.infer<typeof StoreConsolidationSchema>;
