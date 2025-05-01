import { type SupportedNetworkIds } from "pec/constants/chain";
import { type IResponse } from "pec/types/response";
import { executeQuicknodeTypesafeRequest } from "../generics";
import {
  QNPendingPartialWithdrawalResponseSchema,
  QNPendingPartialWithdrawalType,
} from "pec/lib/api/schemas/quicknode/pendingPartialWithdrawals";

/**
 * Gets pending partial withdrawals from the Quicknode API
 */
export const getPendingPartialWithdrawals = async (
  network: SupportedNetworkIds,
): Promise<IResponse<QNPendingPartialWithdrawalType[]>> => {
  return executeQuicknodeTypesafeRequest(
    QNPendingPartialWithdrawalResponseSchema,
    "/eth/v1/beacon/states/head/pending_partial_withdrawals",
    network,
  );
};
