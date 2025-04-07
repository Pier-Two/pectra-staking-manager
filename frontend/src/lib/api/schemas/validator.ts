import { z } from "zod";
import { TransactionStatus, ValidatorStatus } from "pec/types/validator";

export const ValidatorDataSchema = z.object({
  validatorIndex: z.number(),
  publicKey: z.string(),
  withdrawalAddress: z.string(),
  balance: z.number(),
  effectiveBalance: z.number(),
  status: z.nativeEnum(ValidatorStatus),
  numberOfWithdrawals: z.number(),
  activeSince: z.string(),
  activeDuration: z.string(),
  consolidationTransaction: z.object({
    status: z.nativeEnum(TransactionStatus),
    hash: z.string(),
  }).optional(),
  depositTransaction: z.object({
    status: z.nativeEnum(TransactionStatus),
    hash: z.string(),
  }).optional(),
  withdrawalTransaction: z.object({
    status: z.nativeEnum(TransactionStatus),
    hash: z.string(),
  }).optional(),
});
