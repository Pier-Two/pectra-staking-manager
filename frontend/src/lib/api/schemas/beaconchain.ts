import { AxiosResponse } from "axios";
import { BEACONCHAIN_OK_STATUS } from "pec/lib/constants";
import { z } from "zod";

const WithdrawalDataSchema = z.object({
  epoch: z.number(),
  slot: z.number(),
  blockroot: z.string(),
  withdrawalindex: z.number(),
  validatorindex: z.number(),
  address: z.string(),
  amount: z.number(),
});

export const BeaconchainWithdrawalResponseSchema = z.object({
  status: z.literal(BEACONCHAIN_OK_STATUS),
  data: z.array(WithdrawalDataSchema),
});

export type BeaconchainWithdrawalResponse = z.infer<
  typeof BeaconchainWithdrawalResponseSchema
>;

export const isBeaconchainWithdrawalResponseValid = (
  response: AxiosResponse<BeaconchainWithdrawalResponse>,
): boolean => {
  if (!response || response.status !== 200) return false;
  const result = BeaconchainWithdrawalResponseSchema.safeParse(response.data);
  return result.success;
};
