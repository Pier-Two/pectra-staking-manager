import { entries, groupBy, sumBy } from "lodash";
import type { Deposit } from "pec/server/database/classes/deposit";
import { DepositModel } from "pec/server/database/models";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import type { IResponse } from "pec/types/response";
import { SupportedNetworkIds } from "pec/constants/chain";
import { getPendingDeposits } from "../requests/quicknode/getPendingDeposits";
import { QNPendingDepositsType } from "pec/lib/api/schemas/quicknode/pendingDeposits";
import { sendEmailNotification } from "pec/server/helpers/emails/emailService";
import { getMinimumProcessDelay } from "./common";
import { isBefore } from "date-fns";
import { logger } from "../logger";

interface ProcessDepositsParams {
  networkId: SupportedNetworkIds;
  deposits?: Deposit[];
  qnPendingDeposits?: QNPendingDepositsType[];
}

// Function simply processes deposits, it also supports passing an array of subset of deposits in which case it will check and update only those
export const processDeposits = async ({
  networkId,

  ...overrides
}: ProcessDepositsParams): Promise<IResponse> => {
  const deposits =
    overrides?.deposits ??
    (await DepositModel.find({
      status: ACTIVE_STATUS,
      networkId,
    }).sort({ createdAt: 1 }));

  if (deposits.length === 0) return { success: true, data: null };

  let qnPendingDeposits = overrides?.qnPendingDeposits;

  if (!qnPendingDeposits) {
    const responses = await getPendingDeposits(networkId);

    if (!responses.success) return responses;

    qnPendingDeposits = responses.data;
  }

  return processProvidedDeposits(deposits, qnPendingDeposits);
};

// Checks if any of the deposits in the Deposit document aren't in the array of pending deposits, meaning it's been processed.
// Because we can only use the validator index and amount to determine if the deposit is pending, we instead group deposits by this key and compare the counts.
// If the amount of pending is less than the amount of stored deposits, then the difference is the amount of deposits that have been processed. We then mark deposits as processed starting from the oldest.
//
// @param Deposits Deposits that we are processing. The provided deposits override param MUST be ordered by date ascending
export const processProvidedDeposits = async (
  deposits: Deposit[],
  qnPendingDeposits: QNPendingDepositsType[],
): Promise<IResponse> => {
  const filteredDepositsByMinimumProcessDelay = deposits.filter((d) =>
    isBefore(d.createdAt, getMinimumProcessDelay()),
  );
  const groupedQNDeposits = groupBy(qnPendingDeposits, (v) =>
    getDepositsKey(v.pubkey, v.amount),
  );

  const groupedDBDeposits = groupBy(
    filteredDepositsByMinimumProcessDelay.flatMap((d) =>
      d.deposits.map((v) => ({
        publicKey: v.publicKey,
        amount: v.amount,
        txHash: d.txHash,
        email: d.email,
      })),
    ),
    (v) => getDepositsKey(v.publicKey, v.amount),
  );

  // We store this to prevent sending multiple emails for deposits in the same batch
  const processedDeposits: Record<string, boolean> = {};

  for (const [key, storedDeposits] of entries(groupedDBDeposits)) {
    const pendingDeposits = groupedQNDeposits[key];

    const pendingCount = pendingDeposits?.length ?? 0;
    const storedCount = storedDeposits.length;

    const processedCount = storedCount - pendingCount;

    if (processedCount > 0) {
      const depositsToProcess = storedDeposits.slice(0, processedCount);

      for (const deposit of depositsToProcess) {
        // Ensure we don't send multiple emails for the same deposit
        if (!processedDeposits[deposit.txHash]) {
          logger.info(
            `Deposit with txHash ${deposit.txHash} and publicKey ${deposit.publicKey} has been processed`,
          );

          // Not bulk-writing this one because we need the updatedEntry response to send the email
          const updatedEntry = await DepositModel.findOneAndUpdate(
            { txHash: deposit.txHash },
            {
              $set: {
                status: INACTIVE_STATUS,
              },
            },
            { new: true }, // This option returns the modified document rather than the original
          );

          if (!updatedEntry) {
            logger.error(
              `Failed to update and find deposit with txHash ${deposit.txHash}`,
            );

            continue;
          }

          const totalAmount = sumBy(updatedEntry.deposits, (d) => d.amount);

          await sendEmailNotification({
            emailName: "PECTRA_STAKING_MANAGER_DEPOSIT_COMPLETE",
            metadata: {
              emailAddress: deposit.email,
              totalAmount,
            },
          });

          processedDeposits[deposit.txHash] = true;
        }
      }
    }
  }

  return {
    success: true,
    data: null,
  };
};

const getDepositsKey = (publicKey: string, amount: number) =>
  `${publicKey}::${amount}`;
