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
import { sendEmailNotification } from "pec/server/helpers/emails/emailService";
import { getLogger } from "../logger";

const logger = getLogger();

interface ProcessAllValidatorUpgradesParams {
  networkId: SupportedNetworkIds;
  validatorUpgrades?: ValidatorUpgrade[];
  bcValidatorDetails?: BCValidatorDetails[];
}

export const processValidatorUpgrades = async ({
  networkId,

  ...overrides
}: ProcessAllValidatorUpgradesParams): Promise<IResponse> => {
  const validatorUpgrades =
    overrides?.validatorUpgrades ??
    (await ValidatorUpgradeModel.find({
      status: ACTIVE_STATUS,
      networkId,
    }));

  if (validatorUpgrades.length === 0) return { success: true, data: null };

  let bcValidatorDetails = overrides?.bcValidatorDetails;

  if (!bcValidatorDetails) {
    const getValidatorsResponse = await getValidators(
      validatorUpgrades.map(
        (validatorUpgrade) => validatorUpgrade.validatorIndex,
      ),
      networkId,
    );

    if (!getValidatorsResponse.success) return getValidatorsResponse;

    bcValidatorDetails = getValidatorsResponse.data;
  }

  return processProvidedValidatorUpgrades(
    validatorUpgrades,
    bcValidatorDetails,
  );
};

const processProvidedValidatorUpgrades = async (
  validatorUpgrades: ValidatorUpgrade[],
  bcValidatorDetails: BCValidatorDetails[],
): Promise<IResponse> => {
  const keyedBCValidatorDetails = keyBy(
    bcValidatorDetails,
    (v) => v.validatorindex,
  );

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

export const checkValidatorUpgradeProcessedAndUpdate = async (
  dbValidatorUpgrade: ValidatorUpgrade,
  bcValidatorDetails: BCValidatorDetails,
): Promise<boolean> => {
  if (
    getWithdrawalAddressPrefixType(bcValidatorDetails.withdrawalcredentials) ===
    TYPE_2_PREFIX
  ) {
    logger.info(
      `Validator upgrade for validator index ${dbValidatorUpgrade.validatorIndex} is complete.`,
    );
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
