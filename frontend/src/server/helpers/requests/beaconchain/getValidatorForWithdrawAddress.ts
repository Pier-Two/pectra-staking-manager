import { type SupportedNetworkIds } from "pec/constants/chain";
import { executeBeaconChainTypesafeRequest } from "../generics";
import {
  type BCValidatorsForWithdrawAddressResponse,
  BCValidatorsForWithdrawAddressResponseSchema,
  BCValidatorsForWithdrawAddressType,
} from "pec/lib/api/schemas/beaconchain/validator";
import { type IResponse } from "pec/types/response";

const REQUEST_LIMIT = 200;

export const getValidatorsForWithdrawAddress = async (
  withdrawAddress: string,
  network: SupportedNetworkIds,
): Promise<IResponse<BCValidatorsForWithdrawAddressResponse["data"]>> => {
  const url = `/api/v1/validator/withdrawalCredentials/${withdrawAddress}`;

  const responses: BCValidatorsForWithdrawAddressType[] = [];

  while (true) {
    const response = await executeBeaconChainTypesafeRequest(
      BCValidatorsForWithdrawAddressResponseSchema,
      url,
      network,
      {
        params: {
          limit: REQUEST_LIMIT,
          offset: responses.length,
        },
      },
    );

    if (!response.success) return response;

    responses.push(...response.data);

    if (response.data.length < REQUEST_LIMIT) {
      break;
    }
  }

  return {
    success: true,
    data: responses,
  };
};
