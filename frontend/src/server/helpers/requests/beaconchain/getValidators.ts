import { type SupportedNetworkIds } from "pec/constants/chain";
import { BCValidatorsResponseSchema } from "pec/lib/api/schemas/beaconchain/validator";
import { executeBeaconChainTypesafeRequest } from "../generics";
import { chunkRequest } from "../../chunk-request";

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
) => {
  return await chunkRequest(
    validators,
    async (validatorIndexes) => {
      const url = `/api/v1/validator/${validatorIndexes.join(",")}`;

      const response = await executeBeaconChainTypesafeRequest(
        BCValidatorsResponseSchema,
        url,
        network,
      );

      if (response.success) {
        if (Array.isArray(response.data)) {
          if (response.data.length === 0) {
            return { success: false, error: "Validator not found" };
          }

          return { success: true, data: response.data };
        }

        return { success: true, data: [response.data] };
      }

      return response;
    },
    100,
  );
};
