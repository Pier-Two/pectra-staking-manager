import { TYPE_2_PREFIX } from "pec/constants/pectra";
import { type ValidatorUpgrade } from "pec/server/database/classes/validatorUpgrade";
import { ValidatorUpgradeModel } from "pec/server/database/models";
import { getWithdrawalAddressPrefixType } from "pec/lib/utils/validators/withdrawalAddress";
import { type IResponse } from "pec/types/response";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import { getValidators } from "../requests/beaconchain/getValidators";
import { SupportedNetworkIds } from "pec/constants/chain";
import { keyBy } from "lodash";
import { BCValidatorDetails } from "pec/lib/api/schemas/beaconchain/validator";
import { sendEmailNotification } from "pec/lib/services/emailService";

export const checkValidatorUpgradeProcessedAndUpdate = async (
  dbValidatorUpgrade: ValidatorUpgrade,
  bcValidatorDetails: BCValidatorDetails,
): Promise<boolean> => {
  if (
    getWithdrawalAddressPrefixType(bcValidatorDetails.withdrawalcredentials) ===
    TYPE_2_PREFIX
  ) {
    await ValidatorUpgradeModel.updateOne(
      {
        validatorIndex: dbValidatorUpgrade.validatorIndex,
      },
      { $set: { status: INACTIVE_STATUS } },
    );

    await sendEmailNotification({
      emailName: "PECTRA_STAKING_MANAGER_CONSOLIDATION_COMPLETE",
      metadata: {
        emailAddress: dbValidatorUpgrade.email,
        targetValidatorIndex: dbValidatorUpgrade.validatorIndex,
      },
    });

    return true;
  }

  return false;
};

export const processValidatorUpgrades = async (
  networkId: SupportedNetworkIds,
): Promise<IResponse> => {
  const validatorUpgrades = await ValidatorUpgradeModel.find({
    status: ACTIVE_STATUS,
  });

  const response = await getValidators(
    validatorUpgrades.map(
      (validatorUpgrade) => validatorUpgrade.validatorIndex,
    ),
    networkId,
  );

  if (!response.success) return response;

  const keyedBCValidatorDetails = keyBy(response.data, (v) => v.validatorindex);

  for (const validatorUpgrade of validatorUpgrades) {
    const bcValidatorDetails =
      keyedBCValidatorDetails[validatorUpgrade.validatorIndex];

    if (!bcValidatorDetails) {
      console.error(
        `No data found for validator index when processing exits ${validatorUpgrade.validatorIndex}`,
      );

      continue;
    }

    await checkValidatorUpgradeProcessedAndUpdate(
      validatorUpgrade,
      bcValidatorDetails,
    );
  }

  return {
    success: true,
    data: null,
  };
};
