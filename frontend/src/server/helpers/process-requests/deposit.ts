import { groupBy } from "lodash";
import type { Deposit } from "pec/server/database/classes/deposit";
import { DepositModel } from "pec/server/database/models";
import { generateErrorResponse } from "pec/lib/utils";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import type { IResponse } from "pec/types/response";
import { getDeposits } from "../beaconchain/getDeposits";
import { BCDepositData } from "pec/lib/api/schemas/beaconchain/deposits";
import { SupportedNetworkIds } from "pec/constants/chain";

const checkDepositProcessedAndUpdate = async (
  dbDeposit: Deposit,
  validatorDeposits: BCDepositData[],
): Promise<boolean> => {
  const depositExists = validatorDeposits.find(
    (deposit) => deposit.tx_hash === dbDeposit.txHash,
  );

  if (depositExists) {
    // TODO: Integrate
    // await sendEmailNotification(
    //   "PECTRA_STAKING_MANAGER_DEPLOYMENT_COMPLETE",
    //   dbDeposit.email,
    // );

    await DepositModel.updateOne(
      { validatorIndex: dbDeposit.validatorIndex },
      {
        $set: {
          status: INACTIVE_STATUS,
        },
      },
    );

    return true;
  }

  return false;
};

export const processDeposits = async (
  networkId: SupportedNetworkIds,
): Promise<IResponse> => {
  try {
    const deposits = await DepositModel.find({
      status: ACTIVE_STATUS,
    });

    if (!deposits)
      return {
        success: false,
        error: "Deposit query failed to execute.",
      };

    const responses = await getDeposits(
      deposits.map((item) => item.validatorIndex),
      networkId,
    );

    if (!responses.success) return responses;

    const groupedDeposits = groupBy(responses.data, "validatorindex");

    for (const validatorIndex in groupedDeposits) {
      const validatorDeposits = groupedDeposits[validatorIndex]!;

      const deposits = await DepositModel.find({
        validatorIndex: Number(validatorIndex),
        status: ACTIVE_STATUS,
      });

      if (!deposits) continue;

      for (const deposit of deposits) {
        await checkDepositProcessedAndUpdate(deposit, validatorDeposits);
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
