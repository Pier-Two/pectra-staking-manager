import { BEACONCHAIN_OK_STATUS } from "pec/lib/constants";
import { z } from "zod";

export const BCDepositDataSchema = z.object({
  amount: z.number(),
  block_number: z.number(),
  block_ts: z.number(),
  from_address: z.string(),
  merkletree_index: z.string(),
  publickey: z.string(),
  removed: z.boolean(),
  signature: z.string(),
  tx_hash: z.string(),
  tx_index: z.number(),
  tx_input: z.string(),
  valid_signature: z.boolean(),
  withdrawal_credentials: z.string(),
});

export type BCDepositData = z.infer<typeof BCDepositDataSchema>;

export const BCDepositResponseSchema = z.object({
  status: z.literal(BEACONCHAIN_OK_STATUS),
  data: z.array(BCDepositDataSchema),
});

export type BCDepositResponse = z.infer<typeof BCDepositResponseSchema>;
