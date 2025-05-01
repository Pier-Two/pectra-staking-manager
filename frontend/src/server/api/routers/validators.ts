import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import type { BeaconChainValidatorPerformanceResponse } from "pec/types/api";
import { ValidatorStatus, type ValidatorDetails } from "pec/types/validator";
import { SupportedChainIdSchema } from "pec/lib/api/schemas/network";
import { getBeaconChainAxios } from "pec/lib/server/axios";
import {
  PERFORMANCE_FILTERS,
  VALIDATOR_PERFORMANCE_FILTER_TO_BEACONCHAIN,
} from "pec/lib/constants/validators/performance";
import {
  populateBeaconchainValidatorResponse,
  prePopulateBeaconchainValidatorResponse,
} from "pec/server/helpers/validators";
import { getValidators } from "pec/server/helpers/beaconchain/getValidators";
import { routeHandler } from "pec/server/helpers/route-errors";
import { type IResponse } from "pec/types/response";
import { getValidatorsForWithdrawAddress } from "pec/server/helpers/beaconchain/getValidatorForWithdrawAddress";
import { type BCValidatorsData } from "pec/lib/api/schemas/beaconchain/validator";
import {
  ConsolidationModel,
  DepositModel,
  ExitModel,
  ValidatorUpgradeModel,
} from "pec/server/database/models";
import { keyBy, values } from "lodash";
import { checkValidatorUpgradeProcessedAndUpdate } from "pec/server/helpers/process-requests/validatorUpgrade";
import { ACTIVE_STATUS } from "pec/types/app";
import { checkConsolidationProcessedAndUpdate } from "pec/server/helpers/process-requests/consolidation";
import { checkExitProcessedAndUpdate } from "pec/server/helpers/process-requests/exits";
import { redisCacheMiddleware } from "../middleware/redis-cache-middleware";

const populateStuff = async (
  bcValidatorData: BCValidatorsData[],
): Promise<ValidatorDetails[]> => {
  const validatorDetails = bcValidatorData.map(
    prePopulateBeaconchainValidatorResponse,
  );

  const keyedBCValidatorData = keyBy(bcValidatorData, (v) => v.validatorindex);
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

  const allValidatorIndexes = validatorDetails.map((v) => v.validatorIndex);

  const exits = await ExitModel.find({
    validatorIndex: { $in: allValidatorIndexes },
    status: ACTIVE_STATUS,
  });

  for (const exit of exits) {
    const bcValidatorData = keyedBCValidatorData[exit.validatorIndex]!;

    await checkExitProcessedAndUpdate(exit, bcValidatorData);

    // We don't need to do this, the Beaconchain response should set this correctly but why not do this as a just incase.
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

    const isProcessed = await checkValidatorUpgradeProcessedAndUpdate(
      upgrade,
      validator.withdrawalAddress,
    );

    if (!isProcessed) {
      validator.pendingUpgrade = true;
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
    const bcSourceValidator =
      keyedBCValidatorData[consolidation.sourceValidatorIndex];

    if (!bcSourceValidator) {
      console.error(
        `No source validator found for consolidation ${consolidation._id.toString()}`,
      );
      continue;
    }

    // This should definitely exist for the user, but just incase
    const isProcessed = await checkConsolidationProcessedAndUpdate(
      consolidation,
      bcSourceValidator,
    );

    // This would already be exited in most cases, buut just in case
    mutateValidator(consolidation.sourceValidatorIndex, {
      status: ValidatorStatus.EXITED,
    });

    if (!isProcessed) {
      const targetValidatorDetails =
        keyedValidatorDetails[consolidation.targetValidatorIndex];

      // If the current user owns the target validator, we need to modify the target validator to include the pending consolidation request
      if (targetValidatorDetails) {
        mutateValidator(consolidation.targetValidatorIndex, {
          pendingRequests: [
            ...targetValidatorDetails.pendingRequests,
            { type: "consolidation", amount: bcSourceValidator.balance },
          ],
        });
      }
    }
  }

  const deposits = await DepositModel.find({
    validatorIndex: { $in: allValidatorIndexes },
    status: ACTIVE_STATUS,
  });

  if (deposits.length) {
    // const bcDeposits =
  }

  // Use the keyed object here because that is what we mutate throughout the function
  return values(keyedValidatorDetails);
};

export const validatorRouter = createTRPCRouter({
  getValidators: publicProcedure
    .input(z.object({ address: z.string(), chainId: SupportedChainIdSchema }))
    .query(async ({ input: { address, chainId: network } }) =>
      routeHandler(async (): Promise<IResponse<ValidatorDetails[]>> => {
        const withdrawAddressValidators = await getValidatorsForWithdrawAddress(
          address,
          network,
        );

        if (!withdrawAddressValidators.success)
          return withdrawAddressValidators;

        const validatorIndexes = withdrawAddressValidators.data.map(
          (validator) => validator.validatorindex,
        );

        const validatorDetails = await getValidators(validatorIndexes, network);

        if (!validatorDetails.success) return validatorDetails;

        const validators: ValidatorDetails[] = [];

        for (const validator of validatorDetails.data) {
          validators.push(
            await populateBeaconchainValidatorResponse(validator),
          );
        }

        return { success: true, data: validators };
      }),
    ),

  getValidatorsPerformanceInWei: publicProcedure
    .use(redisCacheMiddleware())
    .input(
      z.object({
        address: z.string(),
        chainId: SupportedChainIdSchema,
        filter: z.enum(PERFORMANCE_FILTERS),
      }),
    )
    .query(async ({ input: { address, chainId: network, filter } }) =>
      routeHandler(async (): Promise<IResponse<number>> => {
        const withdrawAddressValidators = await getValidatorsForWithdrawAddress(
          address,
          network,
        );

        if (!withdrawAddressValidators.success)
          return withdrawAddressValidators;

        const validatorIndexes = withdrawAddressValidators.data.map(
          (validator) => validator.validatorindex,
        );

        const validatorPerformances = await getBeaconChainAxios(
          network,
        ).get<BeaconChainValidatorPerformanceResponse>(
          `/api/v1/validator/${validatorIndexes.join(",")}/execution/performance`,
        );

        if (!validatorPerformances.data) return { success: true, data: 0 };

        let totalInWei = 0;

        for (const validatorPerformance of validatorPerformances.data.data) {
          const key = VALIDATOR_PERFORMANCE_FILTER_TO_BEACONCHAIN[filter];
          const value = validatorPerformance[key];

          if (value === undefined) {
            console.error(
              `Key ${key} not found in validator performance data for validator ${validatorPerformance.validatorindex}`,
            );
            continue;
          }

          totalInWei += value;
        }

        return { success: true, data: totalInWei };
      }),
    ),

  getValidatorDetails: publicProcedure
    .input(
      z.object({ searchTerm: z.string(), network: SupportedChainIdSchema }),
    )
    .query(async ({ input: { searchTerm, network } }) =>
      routeHandler(async (): Promise<IResponse<ValidatorDetails>> => {
        const validatorResponse = await getValidators([searchTerm], network);

        if (!validatorResponse.success) return validatorResponse;
        const [validator] = validatorResponse.data;

        if (!validator) {
          return { success: false, error: "NOT_FOUND" };
        }

        const populatedDetails =
          await populateBeaconchainValidatorResponse(validator);

        return { success: true, data: populatedDetails };
      }),
    ),
});
