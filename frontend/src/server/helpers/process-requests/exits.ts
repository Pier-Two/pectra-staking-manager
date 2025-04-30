import { BCValidatorsData } from "pec/lib/api/schemas/beaconchain/validator";
import { Exit } from "pec/lib/database/classes/exit";
import { ExitModel } from "pec/lib/database/models";
import { sendEmailNotification } from "pec/lib/services/emailService";
import { INACTIVE_STATUS } from "pec/types/app";

export const checkExitProcessedAndUpdate = async (
  dbExit: Exit,
  bcValidatorData: BCValidatorsData,
): Promise<boolean> => {
  if (bcValidatorData.status === "exited") {
    await ExitModel.updateOne(
      { validatorIndex: dbExit.validatorIndex },
      { $set: { status: INACTIVE_STATUS } },
    );

    await sendEmailNotification(
      "PECTRA_STAKING_MANAGER_WITHDRAWAL_COMPLETE",
      dbExit.email,
    );

    return true;
  }

  return false;
};
