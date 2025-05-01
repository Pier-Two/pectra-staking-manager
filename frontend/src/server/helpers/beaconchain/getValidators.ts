import { type SupportedNetworkIds } from "pec/constants/chain";
import {
  type BCValidatorsResponse,
  BCValidatorsResponseSchema,
} from "pec/lib/api/schemas/beaconchain/validator";
import { type IResponse } from "pec/types/response";
import { executeBeaconchainTypesafeRequest } from "./generics";
import { chunkRequest } from "../chunk-request";

/**
 * Fetches validator information from the Beaconchain API
 *
 * @param validators - An array of validator indices or addresses
 * @param network - The network ID to use for the API call
 * @returns A promise that resolves to a typed response containing the validator data
 */
export const getValidators = async (
  validators: Array<number | string>,
  network: SupportedNetworkIds,
): Promise<IResponse<BCValidatorsResponse["data"]>> => {
  return await chunkRequest(
    validators,
    async (validatorIndexes) => {
      const url = `/api/v1/validator/${validatorIndexes.join(",")}`;

      return executeBeaconchainTypesafeRequest(
        BCValidatorsResponseSchema,
        url,
        network,
      );
    },
    100,
  );
};
