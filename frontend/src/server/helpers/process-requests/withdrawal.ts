import { CHUNK_SIZE } from "pec/lib/constants";
import { WithdrawalModel } from "pec/lib/database/models";
import { generateErrorResponse } from "pec/lib/utils";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import type { IResponse } from "pec/types/response";
import { chunk, groupBy, maxBy } from "lodash";
import type { Withdrawal } from "pec/lib/database/classes/withdrawal";
import { sendEmailNotification } from "pec/lib/services/emailService";
import { getBeaconChainAxios } from "pec/lib/server/axios";
import { MAIN_CHAIN } from "pec/lib/constants/contracts";
import {
  BCWithdrawalResponse,
  BCWithdrawalResponseSchema,
} from "pec/lib/api/schemas/beaconchain/withdrawals";

export const processWithdrawals = async (): Promise<IResponse> => {
  try {
    const withdrawals = await WithdrawalModel.find({
      status: ACTIVE_STATUS,
    });

    if (!withdrawals)
      return {
        success: false,
        error: "Withdrawal query failed to execute.",
      };

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
        MAIN_CHAIN.id,
      ).get<BCWithdrawalResponse>(
        `/api/v1/validator/${validatorIndexString}/withdrawals`,
      );

      const result = BCWithdrawalResponseSchema.safeParse(response.data);

      if (!result.success) return generateErrorResponse(response.status);

      const groupedValidators = groupWithdrawalsByValidator(response.data);

      for (const validatorIndex in groupedValidators) {
        const validatorWithdrawals = groupedValidators[validatorIndex];
        if (!validatorWithdrawals) continue;

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

        if (currentWithdrawal.email) {
          const email = await sendEmailNotification(
            "PECTRA_STAKING_MANAGER_WITHDRAWAL_COMPLETE",
            currentWithdrawal.email,
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
              withdrawalIndex: lastWithdrawalIndex,
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

const groupWithdrawalsByValidator = (data: BCWithdrawalResponse) => {
  return groupBy(data.data, "validatorindex");
};

const chunkWithdrawals = (withdrawals: Withdrawal[]) => {
  const formatted = withdrawals.map((withdrawal) => ({
    validatorIndex: withdrawal.validatorIndex,
  }));

  return chunk(formatted, CHUNK_SIZE);
};
