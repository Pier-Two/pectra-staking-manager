import { BCValidatorsData } from "pec/lib/api/schemas/beaconchain/validator";
import { Exit } from "pec/server/database/classes/exit";
import { ExitModel } from "pec/server/database/models";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";

export const checkExitProcessedAndUpdate = async (
  dbExit: Exit,
  bcValidatorData: BCValidatorsData,
): Promise<boolean> => {
  if (bcValidatorData.status === "exited") {
    await ExitModel.updateOne(
      { validatorIndex: dbExit.validatorIndex },
      { $set: { status: INACTIVE_STATUS } },
    );

    // await sendEmailNotification(
    //   "PECTRA_STAKING_MANAGER_WITHDRAWAL_COMPLETE",
    //   dbExit.email,
    // );

    return true;
  }

  return false;
};

export const processExits = async (): Promise<void> => {
  try {
    const exits = await ExitModel.find({ status: ACTIVE_STATUS });

    // for (const exit of exits) {
    //   const response = await getValidators(
    //     [exit.validatorIndex],
    //     MAIN_CHAIN.id,
    //   );
    //
    //   if (!response.success) return response;
    //
    //   const validatorDetails = response.data;
    //
    //   if (!validatorDetails) continue;
    //
    //   await checkExitProcessedAndUpdate(exit, validatorDetails);
    // }
  } catch (error) {
    console.error("Error processing exits:", error);
  }
};
