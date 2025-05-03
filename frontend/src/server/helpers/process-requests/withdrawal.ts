import { WithdrawalModel } from "pec/server/database/models";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import type { IResponse } from "pec/types/response";
import { entries, groupBy } from "lodash";
import { SupportedNetworkIds } from "pec/constants/chain";
import { getPendingPartialWithdrawals } from "../requests/quicknode/getPendingPartialWithdrawals";
import { Withdrawal } from "pec/server/database/classes/withdrawal";
import { sendEmailNotification } from "pec/server/helpers/emails/emailService";
import { getMinimumProcessDelay } from "./common";
import { QNPendingPartialWithdrawalType } from "pec/lib/api/schemas/quicknode/pendingPartialWithdrawals";
import { DocumentWithId } from "pec/types/database";
import { getLogger } from "../logger";

const logger = getLogger();

interface ProcessPartialWithdrawalsParams {
  networkId: SupportedNetworkIds;
  withdrawals?: DocumentWithId<Withdrawal>[];
  qnPendingPartialWithdrawals?: QNPendingPartialWithdrawalType[];
}

export const processPartialWithdrawals = async ({
  networkId,

  ...overrides
}: ProcessPartialWithdrawalsParams): Promise<IResponse> => {
  const withdrawals =
    overrides?.withdrawals ??
    (await WithdrawalModel.find({
      status: ACTIVE_STATUS,
      // TODO: Shouldn't this be greater than?
      createdAt: { $lt: getMinimumProcessDelay() },
      networkId,
    }).sort({ createdAt: 1 }));

  let allWithdrawals = overrides.qnPendingPartialWithdrawals;

  if (!allWithdrawals) {
    const response = await getPendingPartialWithdrawals(networkId);

    if (!response.success) return response;

    allWithdrawals = response.data;
  }

  return processProvidedPartialWithdrawals(withdrawals, allWithdrawals);
};

// Check if the provided partial withdrawals isn't in the pending withdrawals
// Because we can only use the validator index and amount to determine if the withdrawal is pending, we instead group withdrawals by this key and compare the counts.
// If the amount of pending is less than the amount of stored withdrawals, then the difference is the amount of withdrawals that have been processed. We then mark withdrawals as processed starting from the oldest.
//
//
// @param withdrawals Withdrawals that we are processing. The provided withdrawals override param MUST be ordered by date ascending and have filtered out documents that have been created before the MINIMUM_PROCESS_DELAY
// @param allPartialWithdrawals Support passing an override array, when we process a user's partial withdrawals we fetch this data earlier
export const processProvidedPartialWithdrawals = async (
  dbWithdrawals: DocumentWithId<Withdrawal>[],
  qnPendingPartialWithdrawals: QNPendingPartialWithdrawalType[],
): Promise<IResponse> => {
  const groupedQNPendingWithdrawals = groupBy(
    qnPendingPartialWithdrawals,
    (withdrawal) =>
      getWithdrawalKey(withdrawal.validator_index, withdrawal.amount),
  );

  const groupedDBWithdrawals = groupBy(dbWithdrawals, (withdrawal) =>
    getWithdrawalKey(withdrawal.validatorIndex, withdrawal.amount),
  );

  for (const [key, storedWithdrawals] of entries(groupedDBWithdrawals)) {
    const pendingWithdrawals = groupedQNPendingWithdrawals[key];

    const pendingCount = pendingWithdrawals?.length ?? 0;
    const storedCount = storedWithdrawals.length;

    const processedCount = storedCount - pendingCount;

    if (processedCount > 0) {
      const withdrawalsToProcess = storedWithdrawals.slice(0, processedCount);

      for (const withdrawal of withdrawalsToProcess) {
        logger.info(
          `Withdrawal for validator index ${withdrawal.validatorIndex} has been processed`,
        );
        await WithdrawalModel.updateOne(
          {
            _id: withdrawal._id,
          },
          { $set: { status: INACTIVE_STATUS } },
        );

        await sendEmailNotification({
          emailName: "PECTRA_STAKING_MANAGER_WITHDRAWAL_COMPLETE",
          metadata: {
            amount: withdrawal.amount,
            emailAddress: withdrawal.email,
            withdrawalAddress: withdrawal.withdrawalAddress,
          },
        });
      }
    }
  }

  return {
    success: true,
    data: null,
  };
};

const getWithdrawalKey = (validatorIndex: number, amount: number) =>
  `${validatorIndex}::${amount}`;
