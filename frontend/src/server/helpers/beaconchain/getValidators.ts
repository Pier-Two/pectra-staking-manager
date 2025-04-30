import { SupportedNetworkIds } from "pec/constants/chain";
import {
  GetValidatorsResponse,
  GetValidatorsResponseSchema,
} from "pec/lib/api/schemas/beaconchain/validator";
import { IResponse } from "pec/types/response";
import { executeBeaconchainTypesafeRequest } from "./generics";

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
): Promise<IResponse<GetValidatorsResponse["data"]>> => {
  const url = `/api/v1/validator/${validators.join(",")}`;

  return executeBeaconchainTypesafeRequest(
    GetValidatorsResponseSchema,
    url,
    network,
  );
};
