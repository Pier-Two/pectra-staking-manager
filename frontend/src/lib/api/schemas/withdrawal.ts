import { z } from "zod";
import { ValidatorDataSchema } from "./validator";
import { EWithdrawalStage } from "pec/types/withdrawal";

export const WithdrawalDataSchema = z.object({
  validator: ValidatorDataSchema,
  amount: z.number().min(0, { message: "Please enter an acceptable amount" }),
});

export type WithdrawalData = z.infer<typeof WithdrawalDataSchema>;

export const WithdrawalSchema = z.object({
  selectedValidators: z.array(ValidatorDataSchema),
  stage: z.nativeEnum(EWithdrawalStage),
  withdrawals: z.array(WithdrawalDataSchema),
});

export type WithdrawalType = z.infer<typeof WithdrawalSchema>;
