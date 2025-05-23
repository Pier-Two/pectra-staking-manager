import { type SupportedNetworkIds } from "pec/constants/chain";
import {
  type BCWithdrawalResponse,
  BCWithdrawalResponseSchema,
} from "pec/lib/api/schemas/beaconchain/withdrawals";
import { type IResponse } from "pec/types/response";
import { executeBeaconChainTypesafeRequest } from "../generics";
import { chunkRequest } from "../../chunk-request";

export const getWithdrawals = async (
  validators: number[],
  network: SupportedNetworkIds,
): Promise<IResponse<BCWithdrawalResponse["data"]>> => {
  return await chunkRequest(
    validators,
    async (validatorIndexes) => {
      const url = `/api/v1/validator/${validatorIndexes.join(",")}/withdrawals`;

      return executeBeaconChainTypesafeRequest(
        BCWithdrawalResponseSchema,
        url,
        network,
      );
    },
    100,
  );
};
