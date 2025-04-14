import { z } from "zod";
import { TransactionStatus, ValidatorStatus } from "pec/types/validator";

const InProgressSchema = z.object({
  status: z.literal(TransactionStatus.IN_PROGRESS),
  isConsolidatedValidator: z.boolean().optional(),
});

const UpcomingSchema = z.object({
  status: z.literal(TransactionStatus.UPCOMING),
  hash: z.string(),
  isConsolidatedValidator: z.boolean().optional(),
});

const SubmittedSchema = z.object({
  status: z.literal(TransactionStatus.SUBMITTED),
  hash: z.string(),
  isConsolidatedValidator: z.boolean().optional(),
});

export const TransactionSchema = z.discriminatedUnion("status", [
  InProgressSchema,
  UpcomingSchema,
  SubmittedSchema,
]);

export const ValidatorDataSchema = z.object({
  validatorIndex: z.number(),
  publicKey: z.string(),
  withdrawalAddress: z.string(),
  balance: z.bigint(),
  effectiveBalance: z.bigint(),
  status: z.nativeEnum(ValidatorStatus),
  numberOfWithdrawals: z.number(),
  activeSince: z.string(),
  activeDuration: z.string(),
  consolidationTransaction: TransactionSchema.optional(),
  depositTransaction: TransactionSchema.optional(),
  withdrawalTransaction: TransactionSchema.optional(),
});
