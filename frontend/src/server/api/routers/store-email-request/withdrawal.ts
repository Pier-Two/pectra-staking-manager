import axios, { type AxiosResponse } from "axios";
import { BEACONCHAIN_OK_STATUS, CHUNK_SIZE } from "pec/lib/constants";
import { UserModel, WithdrawalModel } from "pec/lib/database/models";
import { generateErrorResponse } from "pec/lib/utils";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import type { IResponse } from "pec/types/response";
import { chunk, groupBy, maxBy } from "lodash";
import type { Withdrawal } from "pec/lib/database/classes/withdrawal";
import { z } from "zod";
import { getBeaconChainURL } from "pec/constants/beaconchain";
import { env } from "pec/env";
import { sendEmailNotification } from "pec/lib/services/emailService";

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

export const storeWithdrawalRequest = async (
  validatorIndex: number,
): Promise<IResponse> => {
  try {
    const response = await axios.get<WithdrawalResponse>(
      `${getBeaconChainURL()}/api/v1/validator/${validatorIndex}/withdrawals?apikey=${env.BEACONCHAIN_API_KEY}`,
    );

    if (!isResponseValid(response)) return storeWithdrawal(validatorIndex, 0);

    const lastWithdrawal = maxBy(response.data.data, "withdrawalindex");
    if (!lastWithdrawal) return storeWithdrawal(validatorIndex, 0);
    const lastWithdrawalIndex = Number(lastWithdrawal.withdrawalindex) ?? 0;

    if (!lastWithdrawalIndex || lastWithdrawalIndex === 0)
      return storeWithdrawal(validatorIndex, 0);

    return storeWithdrawal(validatorIndex, lastWithdrawalIndex);
  } catch (error) {
    return generateErrorResponse(error);
  }
};

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

      const response = await axios.get<WithdrawalResponse>(
        `${getBeaconChainURL()}/api/v1/validator/${validatorIndexString}/withdrawals?apikey=${env.BEACONCHAIN_API_KEY}`,
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

        const currentUser = await UserModel.findById(currentWithdrawal.user);
        if (!currentUser) {
          await WithdrawalModel.updateOne(
            { validatorIndex },
            { $set: { status: INACTIVE_STATUS } },
          );
          continue;
        }

        const email = await sendEmailNotification(
          "PECTRA_STAKING_MANAGER_WITHDRAWAL_COMPLETE",
          {
            ...currentUser,
          },
        );

        if (!email.success) {
          console.error("Error sending email notification:", email.error);
          continue;
        }

        if (
          lastWithdrawalIndex !== 0 &&
          lastWithdrawalIndex > currentWithdrawal.withdrawalIndex
        ) {
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

const storeWithdrawal = async (
  validatorIndex: number,
  withdrawalIndex: number,
): Promise<IResponse> => {
  try {
    await WithdrawalModel.create({
      data: {
        validatorIndex,
        withdrawalIndex,
        status: ACTIVE_STATUS,
      },
    });

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return generateErrorResponse(error);
  }
};
