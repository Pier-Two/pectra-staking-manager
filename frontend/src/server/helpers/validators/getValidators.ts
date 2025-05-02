import { SupportedNetworkIds } from "pec/constants/chain";
import { IResponse } from "pec/types/response";
import { getValidatorsForWithdrawAddress } from "../requests/beaconchain/getValidatorForWithdrawAddress";
import {
  ConsolidationModel,
  ExitModel,
  ValidatorUpgradeModel,
} from "pec/server/database/models";
import { ACTIVE_STATUS } from "pec/types/app";
import { prePopulateBeaconchainValidatorResponse } from "../validators";
import { getValidators } from "../requests/beaconchain/getValidators";
import { keyBy } from "lodash";
import { ValidatorDetails, ValidatorStatus } from "pec/types/validator";
import { getWithdrawalAddressPrefixType } from "pec/lib/utils/validators/withdrawalAddress";
import { TYPE_2_PREFIX } from "pec/constants/pectra";

// We don't process anything in the database here and instead operate off of API responses
// Reasoning is so we don't delay the client response longer than we should
export const getAndPopulateValidators = async (
  address: string,
  networkId: SupportedNetworkIds,
): Promise<IResponse<ValidatorDetails[]>> => {
  const bcValidatorsForWithdrawAddress = await getValidatorsForWithdrawAddress(
    address,
    networkId,
  );

  if (!bcValidatorsForWithdrawAddress.success)
    return bcValidatorsForWithdrawAddress;

  const bcValidatorDetails = await getValidators(
    bcValidatorsForWithdrawAddress.data.map(
      (validator) => validator.validatorindex,
    ),
    networkId,
  );

  if (!bcValidatorDetails.success) return bcValidatorDetails;

  const allValidatorIndexes = bcValidatorDetails.data.map(
    (validator) => validator.validatorindex,
  );

  const validatorDetails = bcValidatorDetails.data.map(
    prePopulateBeaconchainValidatorResponse,
  );

  const keyedValidatorDetails = keyBy(
    validatorDetails,
    (v) => v.validatorIndex,
  );

  const mutateValidator = (
    validatorIndex: number,
    fields: Partial<ValidatorDetails>,
  ) => {
    const validator = keyedValidatorDetails[validatorIndex];

    if (!validator) {
      console.error(
        `Validator with validatorIndex ${validatorIndex} not found in validator details`,
      );
      return;
    }

    Object.assign(validator, fields);
  };

  const exits = await ExitModel.find({
    validatorIndex: { $in: allValidatorIndexes },
    status: ACTIVE_STATUS,
  });

  for (const exit of exits) {
    mutateValidator(exit.validatorIndex, {
      status: ValidatorStatus.EXITED,
    });
  }

  const validatorUpgrades = await ValidatorUpgradeModel.find({
    validatorIndex: { $in: allValidatorIndexes },
    status: ACTIVE_STATUS,
  });

  for (const upgrade of validatorUpgrades) {
    const validator = keyedValidatorDetails[upgrade.validatorIndex]!;

    if (
      getWithdrawalAddressPrefixType(validator.withdrawalAddress) !==
      TYPE_2_PREFIX
    ) {
      mutateValidator(upgrade.validatorIndex, {
        pendingUpgrade: true,
      });
    }
  }

  const consolidations = await ConsolidationModel.find({
    status: ACTIVE_STATUS,
    $or: [
      { targetValidatorIndex: { $in: allValidatorIndexes } },
      { sourceValidatorIndex: { $in: allValidatorIndexes } },
    ],
  });

  for (const consolidation of consolidations) {
    const sourceValidator =
      keyedValidatorDetails[consolidation.sourceValidatorIndex];
    const targetValidator =
      keyedValidatorDetails[consolidation.targetValidatorIndex];

    // The user may not have the source validator if someone else consolidated their validator into yours
    if (sourceValidator) {
      mutateValidator(sourceValidator.validatorIndex, {
        status: ValidatorStatus.EXITED,
      });
    }

    if (targetValidator) {
      // If the current user owns the target validator, we need to modify the target validator to include the pending consolidation request
      mutateValidator(targetValidator.validatorIndex, {
        pendingRequests: [
          ...targetValidator.pendingRequests,
          { type: "consolidation", amount: consolidation.amount },
        ],
      });
    }
  }

  // TODO: Deposits and withdrawals

  return {
    success: true,
    data: validatorDetails,
  };
};
