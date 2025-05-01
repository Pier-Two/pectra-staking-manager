import { type AxiosResponse } from "axios";
import { chunk, groupBy, maxBy } from "lodash";
import { z } from "zod";

import type { Withdrawal } from "pec/lib/database/classes/withdrawal";
import type { IResponse } from "pec/types/response";
import { BEACONCHAIN_OK_STATUS, CHUNK_SIZE } from "pec/lib/constants";
import { MAIN_CHAIN } from "pec/lib/constants/contracts";
import { WithdrawalModel } from "pec/lib/database/models";
import { getBeaconChainAxios } from "pec/lib/server/axios";
import { sendEmailNotification } from "pec/lib/services/emailService";
import { generateErrorResponse } from "pec/lib/utils";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";

const WithdrawalDataSchema = z.object({
  epoch: z.number(),
  slot: z.number(),
  blockroot: z.string(),
  withdrawalindex: z.number(),
  validatorindex: z.number(),
  address: z.string(),
  amount: z.number(),
});

const WithdrawalResponseSchema = z.object({
  status: z.literal(BEACONCHAIN_OK_STATUS),
  data: z.array(WithdrawalDataSchema),
});

type WithdrawalResponse = z.infer<typeof WithdrawalResponseSchema>;

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
      ).get<WithdrawalResponse>(
        `/api/v1/validator/${validatorIndexString}/withdrawals`,
      );

      if (!isResponseValid(response))
        return generateErrorResponse(response.status);

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

const groupWithdrawalsByValidator = (data: WithdrawalResponse) => {
  return groupBy(data.data, "validatorindex");
};

const chunkWithdrawals = (withdrawals: Withdrawal[]) => {
  const formatted = withdrawals.map((withdrawal) => ({
    validatorIndex: withdrawal.validatorIndex,
  }));

  return chunk(formatted, CHUNK_SIZE);
};

const isResponseValid = (
  response: AxiosResponse<WithdrawalResponse>,
): boolean => {
  if (!response || response.status !== 200) return false;
  const result = WithdrawalResponseSchema.safeParse(response.data);
  return result.success;
};
