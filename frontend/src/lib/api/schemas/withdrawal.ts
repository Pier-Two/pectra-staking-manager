import { z } from "zod";
import { TransactionStatus, ValidatorStatus } from "pec/types/validator";
import { EWithdrawalStage } from "pec/types/withdrawal";

const ValidatorDataSchema = z.object({
  validatorIndex: z.number(),
  publicKey: z.string(),
  withdrawalAddress: z.string(),
  balance: z.number(),
  effectiveBalance: z.number(),
  status: z.nativeEnum(ValidatorStatus),
  numberOfWithdrawals: z.number(),
  activeSince: z.string(),
  activeDuration: z.string(),
  apy: z.number(),
  transactionStatus: z.nativeEnum(TransactionStatus).optional(),
  transactionHash: z.string().optional(),
});

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
