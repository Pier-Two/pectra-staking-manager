import { z } from "zod";
import { buildBeaconchainResponseSchema } from "./generic";

export const BCWithdrawalDataSchema = z.array(
  z.object({
    epoch: z.number(),
    slot: z.number(),
    blockroot: z.string(),
    withdrawalindex: z.number(),
    validatorindex: z.number(),
    address: z.string(),
    amount: z.number(),
  }),
);

export const BCWithdrawalResponseSchema = buildBeaconchainResponseSchema(
  BCWithdrawalDataSchema,
);

export type BCWithdrawalResponse = z.infer<typeof BCWithdrawalResponseSchema>;
