import { groupBy, sumBy } from "lodash";
import type { Deposit } from "pec/server/database/classes/deposit";
import { DepositModel } from "pec/server/database/models";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import type { IResponse } from "pec/types/response";
import { SupportedNetworkIds } from "pec/constants/chain";
import { getPendingDeposits } from "../requests/quicknode/getPendingDeposits";
import { QNPendingDepositsType } from "pec/lib/api/schemas/quicknode/pendingDeposits";
import { sendEmailNotification } from "pec/lib/services/emailService";
import { getMinimumProcessDelay } from "./common";
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
      createdAt: { $lt: getMinimumProcessDelay() },
    }).sort({ createdAt: -1 }));

  let qnPendingDeposits = overrides?.qnPendingDeposits;

  if (!qnPendingDeposits) {
    const responses = await getPendingDeposits(networkId);

    if (!responses.success) return responses;

    qnPendingDeposits = responses.data;
  }

  return processProvidedDeposits(deposits, qnPendingDeposits);
};

// Checks if any of the deposits in the Deposit document aren't in the array of pending deposits, meaning it's been processed.
// There is an edge-case here where the user submits multiple deposits with the same public key and amount. In this case we only process 1 at a time (because we delete the object). That seems fine because on next run of this it will process the next one.
//
// @param Deposits Deposits that we are processing. The provided deposits override param MUST be ordered by date descending and have filtered out documents that have been created before the MINIMUM_PROCESS_DELAY
const processProvidedDeposits = async (
  deposits: Deposit[],
  qnPendingDeposits: QNPendingDepositsType[],
): Promise<IResponse> => {
  const groupedQNDeposits = groupBy(qnPendingDeposits, (v) =>
    getDepositsKey(v.pubkey, v.amount),
  );

  for (const dbDeposit of deposits) {
    for (const deposit of dbDeposit.deposits) {
      const depositKey = getDepositsKey(deposit.publicKey, deposit.amount);

      if (!groupedQNDeposits[depositKey]) {
        logger.info(
          `Deposit with txHash ${dbDeposit.txHash} and publicKey ${deposit.publicKey} has been processed`,
        );

        await DepositModel.updateOne(
          { txHash: dbDeposit.txHash },
          {
            $set: {
              status: INACTIVE_STATUS,
            },
          },
        );

        const totalAmount = sumBy(dbDeposit.deposits, (d) => d.amount);

        await sendEmailNotification({
          emailName: "PECTRA_STAKING_MANAGER_DEPOSIT_COMPLETE",
          metadata: {
            emailAddress: dbDeposit.email,
            totalAmount,
          },
        });

        // So only send a single email per deposit document
        break;
      } else {
        // Remove the deposit from the grouped deposits
        delete groupedQNDeposits[depositKey];
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
