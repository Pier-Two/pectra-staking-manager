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
  apy: z.number(),
  transactionStatus: z.nativeEnum(TransactionStatus).optional(),
  transactionHash: z.string().optional(),
});
