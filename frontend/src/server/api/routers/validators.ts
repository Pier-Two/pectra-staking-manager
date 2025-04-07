import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import { env } from "pec/env";
import {
  type ValidatorDetailsResponse,
  ValidatorStatus,
} from "pec/types/validator";
import type {
  BeaconChainAllValidatorsResponse,
  BeaconChainValidatorDetailsResponse,
} from "pec/types/api";
import { getValidatorActiveInfo } from "pec/lib/utils/validatorActivity";
import { MOCK_VALIDATORS } from "pec/server/__mocks__/validators";

export const validatorRouter = createTRPCRouter({
  getValidators: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input: { address } }) => {
      return MOCK_VALIDATORS
      try {
        const validators: ValidatorDetailsResponse[] = [];

        const validatorResponse = await fetch(
          `https://beaconcha.in/api/v1/validator/eth1/${address}?api_key=${env.BEACONCHAIN_API_KEY}`,
        );

        if (!validatorResponse.ok) return [];
        const validatorResponseJson =
          (await validatorResponse.json()) as BeaconChainAllValidatorsResponse;
        if (validatorResponseJson.data.length === 0) return [];

        const validatorIndexes = validatorResponseJson.data.map(
          (validator) => validator.validatorindex,
        );

        if (validatorIndexes.length === 0) return [];

        const validatorDetails = await fetch(
          `https://beaconcha.in/api/v1/validator/${validatorIndexes.join(",")}?api_key=${env.BEACONCHAIN_API_KEY}`,
        );

        if (!validatorDetails.ok) return [];
        const validatorDetailsJson =
          (await validatorDetails.json()) as BeaconChainValidatorDetailsResponse;
        if (validatorDetailsJson.data.length === 0) return [];

        validatorDetailsJson.data.forEach((validator) => {
          const { activeSince, activeDuration } = getValidatorActiveInfo(
            validator.activationepoch,
          );

          validators.push({
            validatorIndex: validator.validatorindex,
            publicKey: validator.pubkey,
            withdrawalAddress: validator.withdrawalcredentials,
            balance: validator.balance,
            effectiveBalance: validator.effectivebalance,
            status: validator.status.toLowerCase().includes("active")
              ? ValidatorStatus.ACTIVE
              : ValidatorStatus.INACTIVE,
            numberOfWithdrawals: validator.total_withdrawals,
            activeSince,
            activeDuration,
            withdrawalTransaction: null,
            consolidationTransaction: null,
            depositTransaction: null,
          });
        });

        return validators;
      } catch (error) {
        console.error("Error fetching validators:", error);
        return [];
      }
    }),
});
