import { type SupportedNetworkIds } from "pec/constants/chain";
import { type IResponse } from "pec/types/response";
import { executeQuicknodeTypesafeRequest } from "../generics";
import {
  QNPendingDepositsResponseSchema,
  QNPendingDepositsType,
} from "pec/lib/api/schemas/quicknode/pendingDeposits";

/**
 * Gets pending deposits from the Quicknode API
 */
export const getPendingDeposits = async (
  network: SupportedNetworkIds,
): Promise<IResponse<QNPendingDepositsType[]>> => {
  return executeQuicknodeTypesafeRequest(
    QNPendingDepositsResponseSchema,
    "/eth/v1/beacon/states/head/pending_deposits",
    network,
  );
};
