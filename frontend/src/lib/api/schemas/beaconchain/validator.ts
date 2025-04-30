import { z } from "zod";
import { buildBeaconchainResponseSchema } from "./generic";
import { VALIDATOR_LIFECYCLE_STATUSES } from "pec/types/validator";

export const GetValidatorsDataSchema = z.array(
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

export const GetValidatorsResponseSchema = buildBeaconchainResponseSchema(
  GetValidatorsDataSchema,
);

export type GetValidatorsResponse = z.infer<typeof GetValidatorsResponseSchema>;

export const GetValidatorsForWithdrawAddressSchema = z.array(
  z.object({
    publickey: z.string(),
    valid_signature: z.boolean(),
    validatorindex: z.number(),
  }),
);

export const GetValidatorsForWithdrawAddressResponseSchema =
  buildBeaconchainResponseSchema(GetValidatorsForWithdrawAddressSchema);

export type GetValidatorsForWithdrawAddressResponse = z.infer<
  typeof GetValidatorsForWithdrawAddressResponseSchema
>;
