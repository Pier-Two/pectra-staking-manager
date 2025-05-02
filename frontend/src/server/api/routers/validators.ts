import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import type { BeaconChainValidatorPerformanceResponse } from "pec/types/api";
import { type ValidatorDetails } from "pec/types/validator";
import { SupportedChainIdSchema } from "pec/lib/api/schemas/network";
import { getBeaconChainAxios } from "pec/lib/server/axios";
import {
  PERFORMANCE_FILTERS,
  VALIDATOR_PERFORMANCE_FILTER_TO_BEACONCHAIN,
} from "pec/lib/constants/validators/performance";
import { populateBeaconchainValidatorResponse } from "pec/server/helpers/validators";
import { getValidators } from "pec/server/helpers/requests/beaconchain/getValidators";
import { routeHandler } from "pec/server/helpers/route-errors";
import { type IResponse } from "pec/types/response";
import { getValidatorsForWithdrawAddress } from "pec/server/helpers/requests/beaconchain/getValidatorForWithdrawAddress";
import { redisCacheMiddleware } from "../middleware/redis-cache-middleware";
import { getAndPopulateValidatorDetails } from "pec/server/helpers/validators/getAndPopulateValidatorDetails";

export const validatorRouter = createTRPCRouter({
  getValidators: publicProcedure
    .input(z.object({ address: z.string(), chainId: SupportedChainIdSchema }))
    .query(async ({ input: { address, chainId: network } }) =>
      routeHandler(async (): Promise<IResponse<ValidatorDetails[]>> => {
        return getAndPopulateValidatorDetails(address, network);
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
