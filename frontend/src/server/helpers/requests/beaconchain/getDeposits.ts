import { type SupportedNetworkIds } from "pec/constants/chain";
import { type IResponse } from "pec/types/response";
import { executeBeaconChainTypesafeRequest } from "../generics";
import {
  type BCDepositResponse,
  BCDepositResponseSchema,
} from "pec/lib/api/schemas/beaconchain/deposits";
import { chunkRequest } from "../../chunk-request";

export const getDeposits = async (
  validators: number[],
  network: SupportedNetworkIds,
): Promise<IResponse<BCDepositResponse["data"]>> => {
  return await chunkRequest(
    validators,
    async (validatorIndexes) => {
      const url = `/api/v1/validator/${validatorIndexes.join(",")}/deposits`;

      return executeBeaconChainTypesafeRequest(
        BCDepositResponseSchema,
        url,
        network,
      );
    },
    100,
  );
};
