import { TransactionStatus, ValidatorStatus } from "pec/types/validator";
import { z } from "zod";

const InProgressSchema = z.object({
  status: z.literal(TransactionStatus.IN_PROGRESS),
  hash: z.string().optional(),
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

const PendingRequestsSchema = z.union([
  z.object({
    type: z.literal("consolidation"),
    amount: z.number(),
  }),
  z.object({
    type: z.literal("deposits"),
    amount: z.number(),
  }),
  z.object({
    type: z.literal("withdrawals"),
    amount: z.number(),
  }),
]);

export const ValidatorDataSchema = z.object({
  activeDuration: z.string(),
  activeSince: z.string(),
  balance: z.number(),
  pendingRequests: z.array(PendingRequestsSchema),
  effectiveBalance: z.number(),
  numberOfWithdrawals: z.number(),
  publicKey: z.string(),
  status: z.nativeEnum(ValidatorStatus),
  validatorIndex: z.number(),
  withdrawalAddress: z.string(),
  pendingUpgrade: z.boolean().default(false),
});
