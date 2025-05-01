import { z } from "zod";

export const QNPendingPartialWithdrawal = z.object({
  validator_index: z.string().transform((val) => Number(val)),
  amount: z.string().transform((val) => Number(val) / 1e9),
  withdrawable_epoch: z.string(),
});

export type QNPendingPartialWithdrawalType = z.infer<
  typeof QNPendingPartialWithdrawal
>;

export const QNPendingPartialWithdrawalResponseSchema = z.object({
  data: z.array(QNPendingPartialWithdrawal),
});
