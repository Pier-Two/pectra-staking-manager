import { type SupportedNetworkIds } from "pec/constants/chain";
import { type BCValidatorsResponse } from "pec/lib/api/schemas/beaconchain/validator";
import { type IResponse } from "pec/types/response";
import { executeQuicknodeTypesafeRequest } from "../generics";
import { QNPendingDepositsSchema } from "pec/lib/api/schemas/quicknode/pendingDeposits";

/**
 * Gets pending partial withdrawals from the Quicknode API
 */
export const getPendingPartialWithdrawals = async (
  network: SupportedNetworkIds,
): Promise<IResponse<BCValidatorsResponse["data"]>> => {
  return executeQuicknodeTypesafeRequest(
    QNPendingDepositsSchema,
    "/eth/v1/beacon/states/head/pending_deposits",
    network,
  );
};
