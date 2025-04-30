import { z } from "zod";
import { buildBeaconchainResponseSchema } from "./generic";
import { VALIDATOR_LIFECYCLE_STATUSES } from "pec/types/validator";

export const BCValidatorsDataSchema = z.array(
  z.object({
    activationeligibilityepoch: z.number(),
    activationepoch: z.number(),
    balance: z.number(),
    effectivebalance: z.number(),
    exitepoch: z.number(),
    lastattestationslot: z.number(),
    name: z.string(),
    pubkey: z.string(),
    slashed: z.boolean(),
    status: z.enum(VALIDATOR_LIFECYCLE_STATUSES),
    validatorindex: z.number(),
    withdrawableepoch: z.number(),
    withdrawalcredentials: z.string(),
    total_withdrawals: z.number(),
  }),
);

export const BCValidatorsResponseSchema = buildBeaconchainResponseSchema(
  BCValidatorsDataSchema,
);

export type BCValidatorsResponse = z.infer<typeof BCValidatorsResponseSchema>;

export const BCValidatorsForWithdrawAddressSchema = z.array(
  z.object({
    publickey: z.string(),
    valid_signature: z.boolean(),
    validatorindex: z.number(),
  }),
);

export const BCValidatorsForWithdrawAddressResponseSchema =
  buildBeaconchainResponseSchema(BCValidatorsForWithdrawAddressSchema);

export type BCValidatorsForWithdrawAddressResponse = z.infer<
  typeof BCValidatorsForWithdrawAddressResponseSchema
>;
