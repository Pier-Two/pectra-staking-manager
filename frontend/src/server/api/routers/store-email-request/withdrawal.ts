import axios, { type AxiosResponse } from "axios";
import { BEACONCHAIN_OK_STATUS } from "pec/lib/constants";
import { WithdrawalModel } from "pec/lib/database/models";
import { generateErrorResponse } from "pec/lib/utils";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import type { IResponse } from "pec/types/response";
import { maxBy } from "lodash";

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

export const storeWithdrawalRequest = async (
  validatorIndex: number,
): Promise<IResponse> => {
  try {
    const response = await axios.get<WithdrawalResponse>(
      `https://beaconcha.in/api/v1/validator/${validatorIndex}/withdrawals`,
    );

    if (!isResponseValid(response)) return storeWithdrawal(validatorIndex, 0);
    const withdrawals = response.data.data;
    if (withdrawals.length === 0) return storeWithdrawal(validatorIndex, 0);

    const lastWithdrawal = maxBy(withdrawals, "withdrawalindex");
    const lastWithdrawalIndex = Number(lastWithdrawal?.withdrawalindex) ?? 0;

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

    for (const withdrawal of withdrawals) {
      const { validatorIndex, withdrawalIndex } = withdrawal;
      const response = await axios.get<WithdrawalResponse>(
        `https://beaconcha.in/api/v1/validator/${validatorIndex}/withdrawals`,
      );

      if (!isResponseValid(response))
        return generateErrorResponse(response.status);

      const withdrawals = response.data.data;
      const lastWithdrawal = maxBy(withdrawals, "withdrawalindex");
      const lastWithdrawalIndex = Number(lastWithdrawal?.withdrawalindex) ?? 0;

      if (lastWithdrawalIndex !== 0 && lastWithdrawalIndex > withdrawalIndex) {
        //SEND EMAIL
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
      message: "Withdrawal requests processed successfully.",
    };
  } catch (error) {
    return generateErrorResponse(error);
  }
};

const isResponseValid = (
  response: AxiosResponse<WithdrawalResponse>,
): boolean => {
  return (
    response &&
    response.status === 200 &&
    response.data &&
    typeof response.data === "object" &&
    response.data.status === BEACONCHAIN_OK_STATUS &&
    response.data.data &&
    Array.isArray(response.data.data)
  );
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
