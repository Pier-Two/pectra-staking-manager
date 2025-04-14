import axios, { type AxiosResponse } from "axios";
import { chunk, groupBy } from "lodash";
import { getBeaconChainURL } from "pec/constants/beaconchain";
import { env } from "pec/env";
import { BEACONCHAIN_OK_STATUS, CHUNK_SIZE } from "pec/lib/constants";
import type { Deposit } from "pec/lib/database/classes/deposit";
import { DepositModel } from "pec/lib/database/models";
import { generateErrorResponse } from "pec/lib/utils";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import type { IResponse } from "pec/types/response";
import { z } from "zod";

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

const DepositDataSchema = z.object({
  amount: z.number(),
  block_number: z.number(),
  block_ts: z.number(),
  from_address: z.string(),
  merkletree_index: z.string(),
});

const DepositResponseSchema = z.object({
  status: z.literal(BEACONCHAIN_OK_STATUS),
  data: z.array(DepositDataSchema),
});

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
      data: null,
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
        error: "Deposit query failed to execute.",
      };

    if (deposits.length === 0)
      return {
        success: true,
        data: null,
      };

    const chunkedDeposits = chunkDeposits(deposits);

    for (const chunk of chunkedDeposits) {
      const validatorIndexString = chunk
        .map((item) => item.validatorIndex)
        .join(",");

      const response = await axios.get<DepositResponse>(
        `${getBeaconChainURL()}api/v1/validator/${validatorIndexString}/deposits?apikey=${env.BEACONCHAIN_API_KEY}`,
      );

      if (!isResponseValid(response))
        return generateErrorResponse(response.status);

      const groupedDeposits = groupDepositsByValidator(response.data);

      for (const validatorIndex in groupedDeposits) {
        const validatorDeposits = groupedDeposits[validatorIndex];
        if (!validatorDeposits) continue;

        const targetDeposit = await DepositModel.findOne({
          validatorIndex: Number(validatorIndex),
          status: ACTIVE_STATUS,
        });

        if (!targetDeposit) continue;
        const targetTransactionHash = targetDeposit.txHash;

        const depositExists = validatorDeposits.find(
          (deposit) => deposit.tx_hash === targetTransactionHash,
        );

        if (!depositExists) continue;

        //SEND EMAIL - DEPOSIT COMPLETE
        await DepositModel.updateOne(
          { validatorIndex },
          {
            $set: {
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

const groupDepositsByValidator = (data: DepositResponse) => {
  return groupBy(data.data, "validatorindex");
};

const chunkDeposits = (deposits: Deposit[]) => {
  const formatted = deposits.map((deposit) => ({
    validatorIndex: deposit.validatorIndex,
  }));

  return chunk(formatted, CHUNK_SIZE);
};

const isResponseValid = (response: AxiosResponse<DepositResponse>): boolean => {
  if (!response || response.status !== 200) return false;
  const result = DepositResponseSchema.safeParse(response.data);
  return result.success;
};
