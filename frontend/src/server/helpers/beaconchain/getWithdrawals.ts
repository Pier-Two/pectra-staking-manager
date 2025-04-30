import { SupportedNetworkIds } from "pec/constants/chain";
import {
  BCWithdrawalResponse,
  BCWithdrawalResponseSchema,
} from "pec/lib/api/schemas/beaconchain/withdrawals";
import { IResponse } from "pec/types/response";
import { executeBeaconchainTypesafeRequest } from "./generics";

export const getWithdrawals = async (
  validatorIndex: number,
  network: SupportedNetworkIds,
): Promise<IResponse<BCWithdrawalResponse["data"]>> => {
  const url = `/api/v1/validator/${validatorIndex}/withdrawals`;

  return executeBeaconchainTypesafeRequest(
    BCWithdrawalResponseSchema,
    url,
    network,
  );
};
