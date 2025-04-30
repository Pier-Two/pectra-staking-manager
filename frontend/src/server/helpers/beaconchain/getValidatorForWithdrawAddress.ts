import { SupportedNetworkIds } from "pec/constants/chain";
import { executeBeaconchainTypesafeRequest } from "./generics";
import {
  GetValidatorsForWithdrawAddressResponse,
  GetValidatorsForWithdrawAddressResponseSchema,
} from "pec/lib/api/schemas/beaconchain/validator";
import { IResponse } from "pec/types/response";

export const getValidatorsForWithdrawAddress = async (
  withdrawAddress: string,
  network: SupportedNetworkIds,
): Promise<IResponse<GetValidatorsForWithdrawAddressResponse["data"]>> => {
  const url = `/api/v1/validator/withdrawals/${withdrawAddress}`;

  return executeBeaconchainTypesafeRequest(
    GetValidatorsForWithdrawAddressResponseSchema,
    url,
    network,
    {
      params: {
        limit: 200,
      },
    },
  );
};
