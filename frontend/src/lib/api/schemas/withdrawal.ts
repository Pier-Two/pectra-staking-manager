import { z } from "zod";
import { ValidatorDataSchema } from "./validator";

export const WithdrawalFormSchema = z.object({
  withdrawals: z.array(
    z.object({
      validator: ValidatorDataSchema,
      amount: z
        .number()
        .min(0, { message: "Please enter an acceptable amount" }),
    }),
  ),
});

export type WithdrawalFormType = z.infer<typeof WithdrawalFormSchema>;

export const StoreWithdrawalRequestSchema = z.object({
  validatorIndex: z.number(),
  amount: z.number(),
  txHash: z.string(),
});

export type StoreWithdrawalRequestType = z.infer<
  typeof StoreWithdrawalRequestSchema
>;
