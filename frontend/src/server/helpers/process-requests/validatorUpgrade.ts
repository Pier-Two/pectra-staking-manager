import { TYPE_2_PREFIX } from "pec/constants/pectra";
import { BCValidatorsData } from "pec/lib/api/schemas/beaconchain/validator";
import { ValidatorUpgrade } from "pec/lib/database/classes/validatorUpgrade";
import { ValidatorUpgradeModel } from "pec/lib/database/models";
import { sendEmailNotification } from "pec/lib/services/emailService";
import { generateErrorResponse } from "pec/lib/utils";
import { getWithdrawalAddressPrefixType } from "pec/lib/utils/validators/withdrawalAddress";
import { IResponse } from "pec/types/response";

const checkValidatorUpgradeProcessedAndUpdate = async (
  dbValidatorUpgrade: ValidatorUpgrade,
  bcValidatorDetails: BCValidatorsData,
): Promise<boolean> => {
  if (
    getWithdrawalAddressPrefixType(bcValidatorDetails.withdrawalcredentials) ===
    TYPE_2_PREFIX
  ) {
    await ValidatorUpgradeModel.updateOne(
      {
        validatorIndex: dbValidatorUpgrade.validatorIndex,
      },
      { $set: { status: "inactive" } },
    );

    await sendEmailNotification(
      "PECTRA_STAKING_MANAGER_CONSOLIDATION_COMPLETE",
      dbValidatorUpgrade.email,
    );

    return true;
  }

  return false;
};

export const processValidatorUpgrades = async (): Promise<IResponse> => {
  try {
    const validatorUpgrades = await ValidatorUpgradeModel.find({
      status: "active",
    });

    if (!validatorUpgrades)
      return {
        success: false,
        error: "Validator upgrade query failed to execute.",
      };

    // for (const validatorUpgrade of validatorUpgrades) {
    //   const response = await getValidators(
    //     [validatorUpgrade.validatorIndex],
    //     MAIN_CHAIN.id,
    //   );
    //
    //   if (!response.success) return response;
    //
    //   const validatorDetails = response.data;
    //
    //   if (!validatorDetails) continue;
    //
    //   await checkValidatorUpgradeProcessedAndUpdate(
    //     validatorUpgrade,
    //     validatorDetails,
    //   );
    // }

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return generateErrorResponse(error);
  }
};
