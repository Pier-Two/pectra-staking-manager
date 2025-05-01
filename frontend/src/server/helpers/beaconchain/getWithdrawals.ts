import { SupportedNetworkIds } from "pec/constants/chain";
import {
  BCWithdrawalResponse,
  BCWithdrawalResponseSchema,
} from "pec/lib/api/schemas/beaconchain/withdrawals";
import { IResponse } from "pec/types/response";
import { executeBeaconchainTypesafeRequest } from "./generics";
import { chunkRequest } from "../chunk-request";

export const getWithdrawals = async (
  validators: number[],
  network: SupportedNetworkIds,
): Promise<IResponse<BCWithdrawalResponse["data"]>> => {
  return await chunkRequest(
    validators,
    async (validatorIndexes) => {
      const url = `/api/v1/validator/${validatorIndexes.join(",")}/withdrawals`;

      return executeBeaconchainTypesafeRequest(
        BCWithdrawalResponseSchema,
        url,
        network,
      );
    },
    100,
  );
};
