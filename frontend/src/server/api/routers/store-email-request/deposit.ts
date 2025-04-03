import axios, { type AxiosResponse } from "axios";
import { BEACONCHAIN_OK_STATUS } from "pec/lib/constants";
import { DepositModel } from "pec/lib/database/models";
import { generateErrorResponse } from "pec/lib/utils";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import type { IResponse } from "pec/types/response";

interface DepositResponse {
  status: string;
  data: DepositData[];
}

interface DepositData {
  amount: number;
  block_number: number;
  block_ts: number;
  from_address: string;
  merkletree_index: string;
  publickey: string;
  removed: boolean;
  signature: string;
  tx_hash: string;
  tx_index: number;
  tx_input: string;
  valid_signature: boolean;
  withdrawal_credentials: string;
}

export const storeDepositRequest = async (
  validatorIndex: number,
  txHash: string,
): Promise<IResponse> => {
  try {
    await DepositModel.create({
      validatorIndex,
      txHash,
    });

    return {
      success: true,
      message: "Deposit request stored successfully.",
    };
  } catch (error) {
    return generateErrorResponse(error);
  }
};

export const processDeposits = async (): Promise<IResponse> => {
  try {
    const deposits = await DepositModel.find({
      status: ACTIVE_STATUS,
    });

    if (!deposits)
      return {
        success: false,
        message: "Deposit query failed to execute.",
      };

    if (deposits.length === 0)
      return {
        success: true,
        message: "No active deposits found, nothing to process.",
      };

    for (const deposit of deposits) {
      const { validatorIndex, txHash } = deposit;
      const response = await axios.get<DepositResponse>(
        `https://beaconcha.in/api/v1/validator/${validatorIndex}/deposits`,
      );

      if (!isResponseValid(response))
        return generateErrorResponse(response.status);

      const deposits = response.data.data;
      const depositExists = deposits.find(
        (deposit) => deposit.tx_hash === txHash,
      );

      if (depositExists) {
        //SEND EMAIL - DEPOSIT COMPLETE
        await DepositModel.updateOne(
          { validatorIndex },
          { status: INACTIVE_STATUS },
        );
      }
    }

    return {
      success: true,
      message: "Deposit requests processed successfully.",
    };
  } catch (error) {
    return generateErrorResponse(error);
  }
};

const isResponseValid = (response: AxiosResponse<DepositResponse>): boolean => {
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
