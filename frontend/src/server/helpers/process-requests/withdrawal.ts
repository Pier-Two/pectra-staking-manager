import { WithdrawalModel } from "pec/server/database/models";
import { generateErrorResponse } from "pec/lib/utils";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import type { IResponse } from "pec/types/response";
import { groupBy, maxBy } from "lodash";
import { getWithdrawals } from "../requests/beaconchain/getWithdrawals";
import { SupportedNetworkIds } from "pec/constants/chain";

export const processWithdrawals = async (
  networkId: SupportedNetworkIds,
): Promise<IResponse> => {
  try {
    const withdrawals = await WithdrawalModel.find({
      status: ACTIVE_STATUS,
    });

    if (!withdrawals)
      return {
        success: false,
        error: "Withdrawal query failed to execute.",
      };

    const allWithdrawals = await getWithdrawals(
      withdrawals.map((item) => item.validatorIndex),
      networkId,
    );

    if (!allWithdrawals.success) return allWithdrawals;

    const groupedValidators = groupBy(
      allWithdrawals.data,
      (w) => w.validatorindex,
    );

    for (const validatorIndex in groupedValidators) {
      const validatorWithdrawals = groupedValidators[validatorIndex]!;

      const lastWithdrawal = maxBy(validatorWithdrawals, "withdrawalindex");
      if (!lastWithdrawal) continue;
      const lastWithdrawalIndex = Number(lastWithdrawal.withdrawalindex) ?? 0;

      const currentWithdrawal = await WithdrawalModel.findOne({
        validatorIndex: Number(validatorIndex),
        status: ACTIVE_STATUS,
      });

      if (!currentWithdrawal) continue;
      if (
        lastWithdrawalIndex === 0 ||
        lastWithdrawalIndex <= currentWithdrawal.withdrawalIndex
      )
        continue;

      // TODO: Fix
      // await sendEmailNotification(
      //   "PECTRA_STAKING_MANAGER_WITHDRAWAL_COMPLETE",
      //   currentWithdrawal.email,
      // );

      await WithdrawalModel.updateOne(
        { validatorIndex },
        {
          $set: {
            withdrawalIndex: lastWithdrawalIndex,
            status: INACTIVE_STATUS,
          },
        },
      );
    }

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return generateErrorResponse(error);
  }
};
