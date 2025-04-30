import { BEACONCHAIN_OK_STATUS } from "pec/lib/constants";
import { z } from "zod";

export const WithdrawalDataSchema = z.object({
  epoch: z.number(),
  slot: z.number(),
  blockroot: z.string(),
  withdrawalindex: z.number(),
  validatorindex: z.number(),
  address: z.string(),
  amount: z.number(),
});

export const WithdrawalResponseSchema = z.object({
  status: z.literal(BEACONCHAIN_OK_STATUS),
  data: z.array(WithdrawalDataSchema),
});

export type WithdrawalResponse = z.infer<typeof WithdrawalResponseSchema>;
