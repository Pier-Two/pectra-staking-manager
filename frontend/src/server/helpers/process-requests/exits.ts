import { type BCValidatorsData } from "pec/lib/api/schemas/beaconchain/validator";
import { sendEmailNotification } from "pec/lib/services/emailService";
import { type Exit } from "pec/server/database/classes/exit";
import { ExitModel } from "pec/server/database/models";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import { getValidators } from "../requests/beaconchain/getValidators";
import { SupportedNetworkIds } from "pec/constants/chain";
import { IResponse } from "pec/types/response";
import { keyBy } from "lodash";

export const checkExitProcessedAndUpdate = async (
  dbExit: Exit,
  bcValidatorDetails: BCValidatorsData,
): Promise<boolean> => {
  if (bcValidatorDetails.status === "exited") {
    await ExitModel.updateOne(
      { validatorIndex: dbExit.validatorIndex },
      { $set: { status: INACTIVE_STATUS } },
    );

    await sendEmailNotification({
      emailName: "PECTRA_STAKING_MANAGER_WITHDRAWAL_COMPLETE",
      metadata: {
        amount: dbExit.amount,
        emailAddress: dbExit.email,
        withdrawalAddress: dbExit.withdrawalAddress,
      },
    });

    return true;
  }

  return false;
};

export const processExits = async (
  networkId: SupportedNetworkIds,
): Promise<IResponse> => {
  const exits = await ExitModel.find({ status: ACTIVE_STATUS });

  const response = await getValidators(
    exits.map((exit) => exit.validatorIndex),
    networkId,
  );

  if (!response.success) return response;

  const keyedBCValidatorDetails = keyBy(response.data, (v) => v.validatorindex);

  for (const exit of exits) {
    const bcValidatorDetails = keyedBCValidatorDetails[exit.validatorIndex];

    if (!bcValidatorDetails) {
      console.error(`No data found for validator index ${exit.validatorIndex}`);

      continue;
    }

    await checkExitProcessedAndUpdate(exit, bcValidatorDetails);
  }

  return {
    success: true,
    data: null,
  };
};
