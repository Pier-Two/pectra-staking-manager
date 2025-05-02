import { SupportedNetworkIds } from "pec/constants/chain";
import { IResponse } from "pec/types/response";
import { getValidators } from "pec/server/helpers/requests/beaconchain/getValidators";
import { getValidatorsForWithdrawAddress } from "pec/server/helpers/requests/beaconchain/getValidatorForWithdrawAddress";
import {
  ConsolidationModel,
  DepositEntryModel,
  ExitModel,
  ValidatorUpgradeModel,
  WithdrawalModel,
} from "pec/server/database/models";
import { ACTIVE_STATUS } from "pec/types/app";
import { prePopulateBeaconchainValidatorResponse } from "../validators";
import { groupBy, keyBy } from "lodash";
import { ValidatorDetails, ValidatorStatus } from "pec/types/validator";
import { getWithdrawalAddressPrefixType } from "pec/lib/utils/validators/withdrawalAddress";
import { TYPE_2_PREFIX } from "pec/constants/pectra";
import { getPendingDeposits } from "../requests/quicknode/getPendingDeposits";
import { getPendingPartialWithdrawals } from "../requests/quicknode/getPendingPartialWithdrawals";
import { getLogger } from "../logger";

// We don't process anything in the database here and instead operate off of API responses
// Reasoning is so we don't delay the client response longer than we should
export const getAndPopulateValidatorDetails = async (
  address: string,
  networkId: SupportedNetworkIds,
): Promise<IResponse<ValidatorDetails[]>> => {
  getLogger().info("hey");
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
    networkId,
  });

  for (const exit of exits) {
    mutateValidator(exit.validatorIndex, {
      status: ValidatorStatus.EXITED,
    });
  }

  const validatorUpgrades = await ValidatorUpgradeModel.find({
    validatorIndex: { $in: allValidatorIndexes },
    status: ACTIVE_STATUS,
    networkId,
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
    networkId,
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

  await calculatePendingDepositsForValidators(
    allValidatorIndexes,
    validatorDetails,
    networkId,
    mutateValidator,
  );

  await calculatePendingWithdrawalsForValidators(
    allValidatorIndexes,
    validatorDetails,
    networkId,
    mutateValidator,
  );

  return {
    success: true,
    data: validatorDetails,
  };
};

// This function is used to calculate pending deposits for validators
// We create a separate function for this mostly so the getPendingDeposits has a reduced scope and the memory assigned for this can be re-allocated sooner
const calculatePendingDepositsForValidators = async (
  validatorIndexes: number[],
  validatorDetails: ValidatorDetails[],
  networkId: SupportedNetworkIds,
  mutateValidator: (
    validatorIndex: number,
    fields: Partial<ValidatorDetails>,
  ) => void,
) => {
  // TODO: We need to account for delays in propagation of deposits
  //
  // We only use this to reduce the amount of getPendingDeposits requests ensuring we only do it when we know they have a pending deposit
  const numDeposits = (
    await DepositEntryModel.find({
      validatorIndex: { $in: validatorIndexes },
    })
  ).length;

  if (numDeposits > 0) {
    const pendingDepositsResponse = await getPendingDeposits(networkId);

    if (!pendingDepositsResponse.success) {
      getLogger().error(
        `Error getting pending deposits: ${pendingDepositsResponse.error}`,
      );

      return;
    }

    const groupedPendingDeposits = groupBy(
      pendingDepositsResponse.data,
      (pendingDeposit) => pendingDeposit.pubkey,
    );

    for (const {
      publicKey,
      validatorIndex,
      pendingRequests,
    } of validatorDetails) {
      const pendingDeposits = groupedPendingDeposits[publicKey] ?? [];

      for (const pendingDeposit of pendingDeposits) {
        mutateValidator(validatorIndex, {
          pendingRequests: [
            ...pendingRequests,
            { type: "deposits", amount: pendingDeposit.amount },
          ],
        });
      }
    }
  }
};

export const calculatePendingWithdrawalsForValidators = async (
  validatorIndexes: number[],
  validatorDetails: ValidatorDetails[],
  networkId: SupportedNetworkIds,
  mutateValidator: (
    validatorIndex: number,
    fields: Partial<ValidatorDetails>,
  ) => void,
) => {
  // We only use this to reduce the amount of getPendingWithdrawals requests ensuring we only do it when we know they have a pending deposit
  const numWithdrawals = (
    await WithdrawalModel.find({
      validatorIndex: { $in: validatorIndexes },
      status: ACTIVE_STATUS,
      networkId,
    })
  ).length;

  if (numWithdrawals > 0) {
    const pendingPartialWithdrawals =
      await getPendingPartialWithdrawals(networkId);

    if (!pendingPartialWithdrawals.success) {
      getLogger().error(
        `Error getting partial withdrawals: ${pendingPartialWithdrawals.error}`,
      );

      return;
    }

    const groupedPendingPartialWithdrawals = groupBy(
      pendingPartialWithdrawals.data,
      (pendingDeposit) => pendingDeposit.validator_index,
    );

    for (const {
      publicKey,
      validatorIndex,
      pendingRequests,
    } of validatorDetails) {
      const pendingWithdrawals =
        groupedPendingPartialWithdrawals[publicKey] ?? [];

      for (const pendingWithdrawal of pendingWithdrawals) {
        mutateValidator(validatorIndex, {
          pendingRequests: [
            ...pendingRequests,
            { type: "withdrawals", amount: pendingWithdrawal.amount },
          ],
        });
      }
    }
  }
};
