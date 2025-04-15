import { type AxiosResponse } from "axios";
import { BEACONCHAIN_OK_STATUS, CHUNK_SIZE } from "pec/lib/constants";
import { WithdrawalModel } from "pec/lib/database/models";
import { generateErrorResponse } from "pec/lib/utils";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import type { IResponse } from "pec/types/response";
import { chunk, groupBy, maxBy } from "lodash";
import type { Withdrawal } from "pec/lib/database/classes/withdrawal";
import { z } from "zod";
import { sendEmailNotification } from "pec/lib/services/emailService";
import { SupportedNetworkIds } from "pec/constants/chain";
import { getBeaconChainAxios } from "pec/lib/server/axios";
import { HOODI_CHAIN_ID } from "@piertwo/contracts/constants/networks";
import { isPopulated } from "pec/lib/utils/type-guards";

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
  network: SupportedNetworkIds,
): Promise<IResponse> => {
  try {
    const response = await getBeaconChainAxios(network).get<WithdrawalResponse>(
      `/api/v1/validator/${validatorIndex}/withdrawals`,
    );

    if (!isResponseValid(response)) {
      console.error(
        `Invalid response from BeaconChain API: ${response.status}`,
      );
      return storeWithdrawal(validatorIndex, 0);
    }

    const lastWithdrawal = maxBy(response.data.data, "withdrawalindex");

    return storeWithdrawal(
      validatorIndex,
      lastWithdrawal?.withdrawalindex ?? 0,
    );
  } catch (error) {
    return generateErrorResponse(error);
  }
};

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
        HOODI_CHAIN_ID,
      )<WithdrawalResponse>(
        `/api/v1/validator/${validatorIndexString}/withdrawals`,
      );

      if (!isResponseValid(response)) {
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
