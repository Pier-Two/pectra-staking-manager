import { WithdrawalModel } from "pec/server/database/models";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import type { IResponse } from "pec/types/response";
import { entries, groupBy, keyBy, range } from "lodash";
import { SupportedNetworkIds } from "pec/constants/chain";
import { getPendingPartialWithdrawals } from "../requests/quicknode/getPendingPartialWithdrawals";
import { Withdrawal } from "pec/server/database/classes/withdrawal";
import { sendEmailNotification } from "pec/lib/services/emailService";

interface ProcessPartialWithdrawalsParams {
  networkId: SupportedNetworkIds;
  withdrawals?: Withdrawal[];
}

// 10 minutes
const MINIMUM_PROCESS_DELAY_MS = 10 * 60 * 1000;

const getMinimumProcessDelay = () =>
  new Date(Date.now() - MINIMUM_PROCESS_DELAY_MS);

// Check if the provided partial withdrawals isn't in the pending withdrawals
// Because we can only use the validator index and amount to determine if the withdrawal is pending, we instead group withdrawals by this key and compare the counts.
// If the amount of pending is less than the amount of stored withdrawals, then the difference is the amount of withdrawals that have been processed. We then mark withdrawals as processed starting from the oldest.
//
//
// @dev The provided withdrawals override param MUST be ordered by date descending and have filtered out documents that have been created before the MINIMUM_PROCESS_DELAY
export const processPartialWithdrawals = async ({
  networkId,
  withdrawals: passedWithdrawals,
}: ProcessPartialWithdrawalsParams): Promise<IResponse> => {
  // TODO: Can we pre-filter these by timestamp
  const withdrawals =
    passedWithdrawals ??
    (await WithdrawalModel.find({
      status: ACTIVE_STATUS,
      createdAt: { $lt: getMinimumProcessDelay() },
    }).sort({ createdAt: -1 }));

  const allWithdrawals = await getPendingPartialWithdrawals(networkId);

  if (!allWithdrawals.success) return allWithdrawals;

  const groupedPendingWithdrawals = groupBy(allWithdrawals.data, (withdrawal) =>
    getWithdrawalKey(withdrawal.validator_index, withdrawal.amount),
  );

  const groupedWithdrawals = groupBy(withdrawals, (withdrawal) =>
    getWithdrawalKey(withdrawal.validatorIndex, withdrawal.amount),
  );

  for (const [key, storedWithdrawals] of entries(groupedWithdrawals)) {
    const pendingWithdrawals = groupedPendingWithdrawals[key];

    const pendingCount = pendingWithdrawals?.length ?? 0;
    const storedCount = storedWithdrawals.length;

    const processedCount = storedCount - pendingCount;

    if (processedCount > 0) {
      const withdrawalsToProcess = storedWithdrawals.slice(processedCount);

      for (const withdrawal of withdrawalsToProcess) {
        await WithdrawalModel.updateOne(
          {
            validatorIndex: withdrawal.validatorIndex,
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
