import { z } from "zod";
import { ValidatorDataSchema } from "./validator";

export const WithdrawalDataSchema = z.object({
  validator: ValidatorDataSchema,
  amount: z.number().min(0, { message: "Please enter an acceptable amount" }),
});

export type WithdrawalData = z.infer<typeof WithdrawalDataSchema>;

export enum EWithdrawalStage {
  DATA_CAPTURE = "DATA_CAPTURE",
  TRANSACTIONS_SUBMITTED = "TRANSACTIONS_SUBMITTED",
  TRANSACTIONS_CONFIRMED = "TRANSACTIONS_CONFIRMED",
}

// export const WithdrawalSchema = z.array(
//   ValidatorDataSchema.extend({
//     withdrawalAmount: z.number().optional(),
//   }),
// );

export const WithdrawalSchema = z.object({
  withdrawals: z.array(WithdrawalDataSchema),
});

export type WithdrawalType = z.infer<typeof WithdrawalSchema>;
