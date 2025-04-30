import { chunk, groupBy } from "lodash";
import { CHUNK_SIZE } from "pec/lib/constants";
import { MAIN_CHAIN } from "pec/lib/constants/contracts";
import type { Deposit } from "pec/lib/database/classes/deposit";
import { DepositModel } from "pec/lib/database/models";
import { sendEmailNotification } from "pec/lib/services/emailService";
import { generateErrorResponse } from "pec/lib/utils";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import type { IResponse } from "pec/types/response";
import { getDeposits } from "../beaconchain/getDeposits";
import { BCDepositData } from "pec/lib/api/schemas/beaconchain/deposits";

const checkDepositProcessedAndUpdate = async (
  dbDeposit: Deposit,
  validatorDeposits: BCDepositData[],
): Promise<boolean> => {
  const depositExists = validatorDeposits.find(
    (deposit) => deposit.tx_hash === dbDeposit.txHash,
  );

  if (depositExists) {
    await sendEmailNotification(
      "PECTRA_STAKING_MANAGER_DEPLOYMENT_COMPLETE",
      dbDeposit.email,
    );

    await DepositModel.updateOne(
      { validatorIndex: dbDeposit.validatorIndex },
      {
        $set: {
          status: INACTIVE_STATUS,
        },
      },
    );
  }

  return false;
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

    const chunkedDeposits = chunk(deposits, CHUNK_SIZE);

    for (const chunk of chunkedDeposits) {
      const validatorIndexesForChunk = chunk.map((item) => item.validatorIndex);
      const response = await getDeposits(
        validatorIndexesForChunk,
        MAIN_CHAIN.id,
      );

      if (!response.success) return response;

      const groupedDeposits = groupBy(response.data, "validatorindex");

      for (const validatorIndex in groupedDeposits) {
        const validatorDeposits = groupedDeposits[validatorIndex];
        if (!validatorDeposits) continue;

        const targetDeposit = await DepositModel.findOne({
          validatorIndex: Number(validatorIndex),
          status: ACTIVE_STATUS,
        });

        if (!targetDeposit) continue;

        await checkDepositProcessedAndUpdate(targetDeposit, validatorDeposits);
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
