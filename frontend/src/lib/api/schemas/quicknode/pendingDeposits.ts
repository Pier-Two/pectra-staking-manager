import { z } from "zod";

export const QNPendingDepositsSchema = z.object({
  pubkey: z.string(),
  withdrawal_credentials: z.string(),
  amount: z.string().transform((val) => Number(val) / 1e9),
  signature: z.string(),
  slot: z.string(),
});

export type QNPendingDepositsType = z.infer<typeof QNPendingDepositsSchema>;

export const QNPendingDepositsResponseSchema = z.object({
  data: z.array(QNPendingDepositsSchema),
});
