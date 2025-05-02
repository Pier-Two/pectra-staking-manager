import { keyBy, sumBy } from "lodash";
import type { Deposit } from "pec/server/database/classes/deposit";
import { DepositModel } from "pec/server/database/models";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import type { IResponse } from "pec/types/response";
import { SupportedNetworkIds } from "pec/constants/chain";
import { getPendingDeposits } from "../requests/quicknode/getPendingDeposits";
import { QNPendingDepositsType } from "pec/lib/api/schemas/quicknode/pendingDeposits";
import { sendEmailNotification } from "pec/lib/services/emailService";

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
    }));

  let qnPendingDeposits = overrides?.qnPendingDeposits;

  if (!qnPendingDeposits) {
    const responses = await getPendingDeposits(networkId);

    if (!responses.success) return responses;

    qnPendingDeposits = responses.data;
  }

  return processProvidedDeposits(deposits, qnPendingDeposits);
};

// Checks if any of the deposits in the Deposit document aren't in the array of pending deposits, meaning it's been processed.
// If so, update the status to INACTIVE_STATUS and send an email notification
const processProvidedDeposits = async (
  deposits: Deposit[],
  qnPendingDeposits: QNPendingDepositsType[],
): Promise<IResponse> => {
  const groupedQNDeposits = keyBy(qnPendingDeposits, (v) =>
    getDepositsKey(v.pubkey, v.amount),
  );

  // TODO: bit lost here on if we need to do the double grouping thingo
  // const groupedDBDeposits = keyBy(deposits, (v) =>
  //   getDepositsKey(v.publicKey, v.amount),
  // );

  for (const dbDeposit of deposits) {
    for (const deposit of dbDeposit.deposits) {
      const depositKey = getDepositsKey(deposit.publicKey, deposit.amount);
      if (!groupedQNDeposits[depositKey]) {
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
