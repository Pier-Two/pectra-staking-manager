import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import type {
  BeaconChainAllValidatorsResponse,
  BeaconChainValidatorArrayDetailsResponse,
  BeaconChainValidatorDetailsResponse,
  BeaconChainValidatorPerformanceResponse,
} from "pec/types/api";
import { type ValidatorDetails } from "pec/types/validator";
import { ConsolidationModel } from "pec/lib/database/models";
import { ACTIVE_STATUS } from "pec/types/app";
import { SupportedChainIdSchema } from "pec/lib/api/schemas/network";
import { getBeaconChainAxios } from "pec/lib/server/axios";
import { createContact } from "pec/lib/services/emailService";
import {
  PERFORMANCE_FILTERS,
  VALIDATOR_PERFORMANCE_FILTER_TO_BEACONCHAIN,
} from "pec/lib/constants/validators/performance";
import { populateBeaconchainValidatorDetails } from "pec/server/helpers/validators";

export const validatorRouter = createTRPCRouter({
  getValidators: publicProcedure
    .input(z.object({ address: z.string(), chainId: SupportedChainIdSchema }))
    .query(async ({ input: { address, chainId: network } }) => {
      try {
        const validatorResponse = await getBeaconChainAxios(
          network,
        ).get<BeaconChainAllValidatorsResponse>(
          `/api/v1/validator/withdrawalCredentials/${address}`,
          {
            params: {
              limit: 200,
            },
          },
        );

        if (!validatorResponse.data || validatorResponse.data.data.length === 0)
          return [];

        const validatorIndexes = validatorResponse.data.data.map(
          (validator) => validator.validatorindex,
        );

        const validatorDetails = await getBeaconChainAxios(
          network,
        ).get<BeaconChainValidatorArrayDetailsResponse>(
          `/api/v1/validator/${validatorIndexes.join(",")}`,
        );

        if (!validatorDetails.data) return [];

        const validators: ValidatorDetails[] = [];

        for (const validator of validatorDetails.data.data) {
          validators.push(await populateBeaconchainValidatorDetails(validator));
        }

        return validators;
      } catch (error) {
        console.error("Error fetching validators:", error);
        return [];
      }
    }),

  getValidatorsPerformanceInWei: publicProcedure
    .input(
      z.object({
        address: z.string(),
        chainId: SupportedChainIdSchema,
        filter: z.enum(PERFORMANCE_FILTERS),
      }),
    )
    .query(async ({ input: { address, chainId: network, filter } }) => {
      try {
        const validatorResponse = await getBeaconChainAxios(
          network,
        ).get<BeaconChainAllValidatorsResponse>(
          `/api/v1/validator/withdrawalCredentials/${address}`,
          {
            params: {
              limit: 200,
            },
          },
        );

        if (!validatorResponse.data || validatorResponse.data.data.length === 0)
          return 0;

        const validatorIndexes = validatorResponse.data.data.map(
          (validator) => validator.validatorindex,
        );

        const validatorPerformances = await getBeaconChainAxios(
          network,
        ).get<BeaconChainValidatorPerformanceResponse>(
          `/api/v1/validator/${validatorIndexes.join(",")}/execution/performance`,
        );

        if (!validatorPerformances.data) return 0;

        let totalInWei = 0;

        for (const validatorPerformance of validatorPerformances.data.data) {
          const key = VALIDATOR_PERFORMANCE_FILTER_TO_BEACONCHAIN[filter];
          totalInWei += validatorPerformance[key] ?? 0;
        }

        return totalInWei;
      } catch (error) {
        console.error("Error fetching validators performance:", error);
        return 0;
      }
    }),

  getValidatorDetails: publicProcedure
    .input(
      z.object({ searchTerm: z.string(), network: SupportedChainIdSchema }),
    )
    .query(async ({ input: { searchTerm, network } }) => {
      try {
        const { data } = await getBeaconChainAxios(
          network,
        ).get<BeaconChainValidatorDetailsResponse>(
          `/api/v1/validator/${searchTerm}`,
        );

        const validator = data.data;

        if (!validator.validatorindex) return "NOT_FOUND";

        return await populateBeaconchainValidatorDetails(validator);
      } catch (error) {
        console.error("Error getting validator: ", error);
        return "NOT_FOUND";
      }
    }),

  updateConsolidationRecord: publicProcedure
    .input(
      z.object({
        targetValidatorIndex: z.number(),
        sourceTargetValidatorIndex: z.number(),
        txHash: z.string(),
        email: z.string().email().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const {
        targetValidatorIndex,
        sourceTargetValidatorIndex,
        txHash,
        email,
      } = input;

      const existingRecord = await ConsolidationModel.findOne({
        $or: [
          {
            targetValidatorIndex,
            sourceTargetValidatorIndex,
          },
          {
            targetValidatorIndex: sourceTargetValidatorIndex,
            sourceTargetValidatorIndex: targetValidatorIndex,
          },
        ],
      });

      if (existingRecord)
        throw new Error(
          `Consolidation record already exists for validators ${targetValidatorIndex} and ${sourceTargetValidatorIndex}`,
        );

      const newRecord = await ConsolidationModel.create({
        targetValidatorIndex,
        sourceTargetValidatorIndex,
        status: ACTIVE_STATUS,
        txHash,
        email,
      });

      if (email) {
        const contactResponse = await createContact(email);

        if (!contactResponse.success)
          console.error(
            `Error creating contact in Hubspot for ${email}`,
            contactResponse.error,
          );
      }

      return {
        success: true,
        record: newRecord,
      };
    }),
});
