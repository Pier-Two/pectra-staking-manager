import { SupportedNetworkIds } from "pec/constants/chain";
import { IResponse } from "pec/types/response";
import { getValidators } from "pec/server/helpers/requests/beaconchain/getValidators";
import { getValidatorsForWithdrawAddress } from "pec/server/helpers/requests/beaconchain/getValidatorForWithdrawAddress";
import {
  ConsolidationModel,
  DepositModel,
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
import { processProvidedDeposits } from "../process-requests/deposit";
import { processProvidedPartialWithdrawals } from "../process-requests/withdrawal";

// We don't process anything in the database here and instead operate off of API responses
// Reasoning is so we don't delay the client response longer than we should
export const getAndPopulateValidatorDetails = async (
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

  const validatorDetails = bcValidatorDetails.data.map(
    prePopulateBeaconchainValidatorResponse,
  );

  const allValidatorIndexes = validatorDetails.map(
    (validator) => validator.validatorIndex,
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

    if (fields.pendingRequests) {
      for (const pendingRequest of fields.pendingRequests) {
        if (pendingRequest.type === "withdrawals") {
          fields.balance = validator.balance - pendingRequest.amount;
          fields.pendingBalance =
            validator.pendingBalance - pendingRequest.amount;
        } else if (pendingRequest.type === "deposits") {
          fields.pendingBalance =
            validator.pendingBalance + pendingRequest.amount;
        } else if (pendingRequest.type === "consolidation") {
          fields.pendingBalance =
            validator.pendingBalance + pendingRequest.amount;
        }
      }

      fields.pendingRequests = [
        ...(validator.pendingRequests ?? []),
        ...fields.pendingRequests,
      ];
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
          { type: "consolidation", amount: consolidation.amount },
        ],
      });
    }
  }

  await calculatePendingDepositsForValidators(
    address,
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
  withdrawalAddress: string,
  validatorDetails: ValidatorDetails[],
  networkId: SupportedNetworkIds,
  mutateValidator: (
    validatorIndex: number,
    fields: Partial<ValidatorDetails>,
  ) => void,
) => {
  const deposits = await DepositModel.find({
    withdrawalAddress,
    status: ACTIVE_STATUS,
    networkId,
  });

  // We only use this to reduce the amount of getPendingDeposits requests ensuring we only do it when we know they have a pending deposit
  if (deposits.length > 0) {
    const pendingDepositsResponse = await getPendingDeposits(networkId);

    if (!pendingDepositsResponse.success) {
      getLogger().error(
        `Error getting pending deposits: ${pendingDepositsResponse.error}`,
      );

      return;
    }

    // We have to process deposits here, so that we can refetch Deposits from the DB ensuring they are up to date
    const processDepositsResult = await processProvidedDeposits(
      deposits,
      pendingDepositsResponse.data,
    );

    if (!processDepositsResult.success) {
      getLogger().error(
        `Error processing deposits when fetching validators: ${processDepositsResult.error}`,
      );
    }

    const updatedDeposits = await DepositModel.find({
      status: ACTIVE_STATUS,
      withdrawalAddress,
      networkId,
    });

    const flattedDeposits = updatedDeposits.flatMap(
      (deposit) => deposit.deposits,
    );

    const groupedPendingDeposits = groupBy(
      pendingDepositsResponse.data,
      (pendingDeposit) => pendingDeposit.pubkey,
    );

    for (const { publicKey, validatorIndex } of validatorDetails) {
      const pendingDeposits = groupedPendingDeposits[publicKey] ?? [];

      for (const pendingDeposit of pendingDeposits) {
        // We need to remove each found deposit from the flatted deposits array
        const index = flattedDeposits.findIndex(
          (deposit) =>
            deposit.validatorIndex === validatorIndex &&
            deposit.amount === pendingDeposit.amount,
        );

        if (index !== -1) {
          flattedDeposits.splice(index, 1);
        }

        mutateValidator(validatorIndex, {
          pendingRequests: [
            { type: "deposits", amount: pendingDeposit.amount },
          ],
        });
      }
    }

    // Finally include all the remaining flattened deposits, that weren't included in the quicknode response
    // This ensures we don't miss any deposits that were made before quicknode has a chance to pick them up
    for (const remainingDeposit of flattedDeposits) {
      mutateValidator(remainingDeposit.validatorIndex, {
        pendingRequests: [
          { type: "deposits", amount: remainingDeposit.amount },
        ],
      });
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
  const withdrawals = await WithdrawalModel.find({
    validatorIndex: { $in: validatorIndexes },
    status: ACTIVE_STATUS,
    networkId,
  });

  if (withdrawals.length > 0) {
    const pendingPartialWithdrawals =
      await getPendingPartialWithdrawals(networkId);

    if (!pendingPartialWithdrawals.success) {
      getLogger().error(
        `Error getting partial withdrawals: ${pendingPartialWithdrawals.error}`,
      );

      return;
    }

    const processWithdrawalsResult = await processProvidedPartialWithdrawals(
      withdrawals,
      pendingPartialWithdrawals.data,
    );

    if (!processWithdrawalsResult.success) {
      getLogger().error(
        `Error processing partial withdrawals when fetching validators: ${processWithdrawalsResult.error}`,
      );
    }

    const updatedWithdrawals = await WithdrawalModel.find({
      status: ACTIVE_STATUS,
      validatorIndex: { $in: validatorIndexes },
      networkId,
    });

    const groupedPendingPartialWithdrawals = groupBy(
      pendingPartialWithdrawals.data,
      (pendingDeposit) => pendingDeposit.validator_index,
    );

    for (const { publicKey, validatorIndex } of validatorDetails) {
      const pendingWithdrawals =
        groupedPendingPartialWithdrawals[publicKey] ?? [];

      for (const pendingWithdrawal of pendingWithdrawals) {
        const foundIndex = updatedWithdrawals.findIndex(
          (withdrawal) =>
            withdrawal.validatorIndex === validatorIndex &&
            withdrawal.amount === pendingWithdrawal.amount,
        );

        if (foundIndex !== -1) {
          updatedWithdrawals.splice(foundIndex, 1);
        }

        mutateValidator(validatorIndex, {
          pendingRequests: [
            { type: "withdrawals", amount: pendingWithdrawal.amount },
          ],
        });
      }
    }

    // Finally include all the remaining withdrawals, that weren't included in the quicknode response
    for (const remainingWithdrawal of updatedWithdrawals) {
      mutateValidator(remainingWithdrawal.validatorIndex, {
        pendingRequests: [
          { type: "withdrawals", amount: remainingWithdrawal.amount },
        ],
      });
    }
  }
};
