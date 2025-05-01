import { z } from "zod";

export const QNPendingPartialWithdrawals = z.object({
  validator_index: z.string().transform((val) => Number(val)),
  amount: z.string().transform((val) => Number(val) / 1e9),
  withdrawable_epoch: z.string(),
});

export type QNPendingDepositsType = z.infer<typeof QNPendingPartialWithdrawals>;

export const QNPendingDepositsResponseSchema = z.object({
  data: z.array(QNPendingPartialWithdrawals),
});
