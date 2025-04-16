import { CHUNK_SIZE } from "pec/lib/constants";
import { WithdrawalModel } from "pec/lib/database/models";
import { generateErrorResponse } from "pec/lib/utils";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import type { IResponse } from "pec/types/response";
import { chunk, groupBy, maxBy } from "lodash";
import type { Withdrawal } from "pec/lib/database/classes/withdrawal";
import { sendEmailNotification } from "pec/lib/services/emailService";
import { getBeaconChainAxios } from "pec/lib/server/axios";
import { isPopulated } from "pec/lib/utils/type-guards";
import { PROCESS_REQUESTS_NETWORK_ID } from "pec/lib/constants/feature-flags";
import {
  BeaconchainWithdrawalResponse,
  isBeaconchainWithdrawalResponseValid,
} from "pec/lib/api/schemas/beaconchain";

export const processWithdrawals = async (): Promise<IResponse> => {
  try {
    const withdrawals = await WithdrawalModel.find({
      status: ACTIVE_STATUS,
    });

    if (withdrawals.length === 0)
      return {
        success: true,
        data: null,
      };

    const chunkedWithdrawals = chunkWithdrawals(withdrawals);

    for (const chunk of chunkedWithdrawals) {
      const validatorIndexString = chunk
        .map((item) => item.validatorIndex)
        .join(",");

      const response = await getBeaconChainAxios(
        PROCESS_REQUESTS_NETWORK_ID,
      )<BeaconchainWithdrawalResponse>(
        `/api/v1/validator/${validatorIndexString}/withdrawals`,
      );

      if (!isBeaconchainWithdrawalResponseValid(response)) {
        return generateErrorResponse(response.status);
      }

      const groupedValidators = groupBy(response.data.data, "validatorindex");

      for (const validatorIndex in groupedValidators) {
        const currentWithdrawal = await WithdrawalModel.findOne({
          validatorIndex: Number(validatorIndex),
          status: ACTIVE_STATUS,
        }).populate("user");

        if (!currentWithdrawal) continue;

        const validatorWithdrawals = groupedValidators[validatorIndex] ?? [];

        const newLastWithdrawalIndex =
          maxBy(validatorWithdrawals, "withdrawalindex")?.withdrawalindex ?? 0;

        if (newLastWithdrawalIndex <= currentWithdrawal.withdrawalIndex)
          continue;

        if (isPopulated(currentWithdrawal.user)) {
          const email = await sendEmailNotification(
            "PECTRA_STAKING_MANAGER_WITHDRAWAL_COMPLETE",
            {
              ...currentWithdrawal.user,
            },
          );

          if (!email.success) {
            console.error("Error sending email notification:", email.error);
            continue;
          }
        }

        await WithdrawalModel.updateOne(
          { validatorIndex },
          {
            $set: {
              withdrawalIndex: newLastWithdrawalIndex,
              status: INACTIVE_STATUS,
            },
          },
        );
      }
    }

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return generateErrorResponse(error);
  }
};

const chunkWithdrawals = (withdrawals: Withdrawal[]) => {
  const formatted = withdrawals.map((withdrawal) => ({
    validatorIndex: withdrawal.validatorIndex,
  }));

  return chunk(formatted, CHUNK_SIZE);
};
