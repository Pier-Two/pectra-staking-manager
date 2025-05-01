import { keyBy, sumBy } from "lodash";
import type { Deposit } from "pec/server/database/classes/deposit";
import { DepositModel } from "pec/server/database/models";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import type { IResponse } from "pec/types/response";
import { SupportedNetworkIds } from "pec/constants/chain";
import { getPendingDeposits } from "../requests/quicknode/getPendingDeposits";
import { QNPendingDepositsType } from "pec/lib/api/schemas/quicknode/pendingDeposits";
import { sendEmailNotification } from "pec/lib/services/emailService";

// Checks if any of the deposits in the Deposit document aren't in the array of pending deposits, meaning it's been processed.
// If so, update the status to INACTIVE_STATUS and send an email notification
const checkDepositProcessedAndUpdate = async (
  qnPendingDeposits: Record<string, QNPendingDepositsType>,
  dbDeposit: Deposit,
): Promise<boolean> => {
  // TODO: Check minimum time has passed for propagation to indexers

  for (const deposit of dbDeposit.deposits) {
    const depositKey = getDepositsKey(deposit.publicKey, deposit.amount);
    if (!qnPendingDeposits[depositKey]) {
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

      return true;
    }
  }

  return false;
};

// Function simply processes deposits, it also supports passing an array of subset of deposits in which case it will check and update only those
export const processAllDeposits = async (
  networkId: SupportedNetworkIds,
  passedDeposits?: Deposit[],
): Promise<IResponse> => {
  const deposits =
    passedDeposits ??
    (await DepositModel.find({
      status: ACTIVE_STATUS,
    }));

  const responses = await getPendingDeposits(networkId);

  if (!responses.success) return responses;

  const groupedDeposits = keyBy(responses.data, (v) =>
    getDepositsKey(v.pubkey, v.amount),
  );

  for (const deposit of deposits) {
    await checkDepositProcessedAndUpdate(groupedDeposits, deposit);
  }

  return {
    success: true,
    data: null,
  };
};

// Excessive but its predictable
const getDepositsKey = (publicKey: string, amount: number) =>
  `${publicKey}::${amount}`;
