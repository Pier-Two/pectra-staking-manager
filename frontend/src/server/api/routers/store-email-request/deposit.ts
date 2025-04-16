import axios, { type AxiosResponse } from "axios";
import { chunk, groupBy } from "lodash";
import { getBeaconChainURL } from "pec/constants/beaconchain";
import { env } from "pec/env";
import { BEACONCHAIN_OK_STATUS, CHUNK_SIZE } from "pec/lib/constants";
import { MAIN_CHAIN } from "pec/lib/constants/contracts";
import type { Deposit } from "pec/lib/database/classes/deposit";
import { DepositModel, UserModel } from "pec/lib/database/models";
import { getBeaconChainAxios } from "pec/lib/server/axios";
import { sendEmailNotification } from "pec/lib/services/emailService";
import { generateErrorResponse } from "pec/lib/utils";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import type { IResponse } from "pec/types/response";
import { z } from "zod";

const DepositDataSchema = z.object({
  amount: z.number(),
  block_number: z.number(),
  block_ts: z.number(),
  from_address: z.string(),
  merkletree_index: z.string(),
  publickey: z.string(),
  removed: z.boolean(),
  signature: z.string(),
  tx_hash: z.string(),
  tx_index: z.number(),
  tx_input: z.string(),
  valid_signature: z.boolean(),
  withdrawal_credentials: z.string(),
});

const DepositResponseSchema = z.object({
  status: z.literal(BEACONCHAIN_OK_STATUS),
  data: z.array(DepositDataSchema),
});

type DepositResponse = z.infer<typeof DepositResponseSchema>;

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

      const response = await getBeaconChainAxios(
        MAIN_CHAIN.id,
      ).get<DepositResponse>(
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

        if (targetDeposit.email) {
          const email = await sendEmailNotification(
            "PECTRA_STAKING_MANAGER_DEPLOYMENT_COMPLETE",
            targetDeposit.email,
          );

          if (!email.success) {
            console.error("Error sending email notification:", email.error);
            continue;
          }
        }

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
