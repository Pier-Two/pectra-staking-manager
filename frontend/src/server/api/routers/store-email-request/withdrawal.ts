import axios, { type AxiosResponse } from "axios";
import { BEACONCHAIN_OK_STATUS, CHUNK_SIZE } from "pec/lib/constants";
import { WithdrawalModel } from "pec/lib/database/models";
import { generateErrorResponse } from "pec/lib/utils";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import type { IResponse } from "pec/types/response";
import { chunk, groupBy, maxBy } from "lodash";
import type { Withdrawal } from "pec/lib/database/classes/withdrawal";
import { z } from "zod";
import { getBeaconChainURL } from "pec/constants/beaconchain";
import { env } from "pec/env";

interface WithdrawalResponse {
  status: string;
  data: WithdrawalData[];
}

interface WithdrawalData {
  epoch: number;
  slot: number;
  blockroot: string;
  withdrawalindex: number;
  validatorindex: number;
  address: string;
  amount: number;
}

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

export const storeWithdrawalRequest = async (
  validatorIndex: number,
): Promise<IResponse> => {
  try {
    // TODO hardcoded env here
    const response = await axios.get<WithdrawalResponse>(
      `${getBeaconChainURL(true)}/api/v1/validator/${validatorIndex}/withdrawals?apikey=${env.BEACONCHAIN_API_KEY}`,
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
        message: "Withdrawal query failed to execute.",
      };

    if (withdrawals.length === 0)
      return {
        success: true,
        message: "No active withdrawals found, nothing to process.",
      };

    const chunkedWithdrawals = chunkWithdrawals(withdrawals);

    for (const chunk of chunkedWithdrawals) {
      const validatorIndexString = chunk
        .map((item) => item.validatorIndex)
        .join(",");

      // TODO hardcoded env here
      const response = await axios.get<WithdrawalResponse>(
        `${getBeaconChainURL(true)}/api/v1/validator/${validatorIndexString}/withdrawals?apikey=${env.BEACONCHAIN_API_KEY}`,
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
          lastWithdrawalIndex !== 0 &&
          lastWithdrawalIndex > currentWithdrawal.withdrawalIndex
        ) {
          console.log("Log for Vercel deployment - WITHDRAWAL COMPLETE");
          //SEND EMAIL - WITHDRAWAL COMPLETE
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
      message: "Withdrawal requests processed successfully.",
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
      message: "Withdrawal request stored successfully.",
    };
  } catch (error) {
    return generateErrorResponse(error);
  }
};
