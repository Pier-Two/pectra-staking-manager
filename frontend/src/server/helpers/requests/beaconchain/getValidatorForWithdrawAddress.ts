import { type SupportedNetworkIds } from "pec/constants/chain";
import { executeBeaconChainTypesafeRequest } from "../generics";
import {
  type BCValidatorsForWithdrawAddressResponse,
  BCValidatorsForWithdrawAddressResponseSchema,
} from "pec/lib/api/schemas/beaconchain/validator";
import { type IResponse } from "pec/types/response";

export const getValidatorsForWithdrawAddress = async (
  withdrawAddress: string,
  network: SupportedNetworkIds,
): Promise<IResponse<BCValidatorsForWithdrawAddressResponse["data"]>> => {
  const url = `/api/v1/validator/eth1/${withdrawAddress}`;

  return executeBeaconChainTypesafeRequest(
    BCValidatorsForWithdrawAddressResponseSchema,
    url,
    network,
    {
      params: {
        limit: 2000,
      },
    },
  );
};
