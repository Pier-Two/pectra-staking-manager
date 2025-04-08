import axios from "axios";
import { z } from "zod";

import { env } from "pec/env";
import { getValidatorActiveInfo } from "pec/lib/utils/validatorActivity";
import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import type {
  BeaconChainAllValidatorsResponse,
  BeaconChainValidatorDetailsResponse,
} from "pec/types/api";
import {
  type ValidatorDetailsResponse,
  ValidatorStatus,
} from "pec/types/validator";

const getBeaconChainURL = (isTestnet: boolean): `${string}/` =>
  `https://${isTestnet && "hoodi."}beaconcha.in/`;

export const validatorRouter = createTRPCRouter({
  getValidators: publicProcedure
    .input(
      z.object({ address: z.string(), isTestnet: z.boolean().default(true) }), // TODO actually use isTestnet in front end
    )
    .query(async ({ input: { address, isTestnet } }) => {
      try {
        const validators: ValidatorDetailsResponse[] = [];

        const validatorResponse =
          await axios.get<BeaconChainAllValidatorsResponse>(
            `${getBeaconChainURL(isTestnet)}api/v1/validator/withdrawalCredentials/${address}?apikey=${env.BEACONCHAIN_API_KEY}`,
          );

        if (!validatorResponse.data || validatorResponse.data.data.length === 0)
          return [];

        const validatorIndexes = validatorResponse.data.data.map(
          (validator) => validator.validatorindex,
        );

        if (validatorIndexes.length === 0) return [];

        const validatorDetails =
          await axios.get<BeaconChainValidatorDetailsResponse>(
            `${getBeaconChainURL(isTestnet)}/api/v1/validator/${validatorIndexes.join(",")}?apikey=${env.BEACONCHAIN_API_KEY}`,
          );

        if (!validatorDetails.data || validatorDetails.data.data.length === 0)
          return [];

        validatorDetails.data.data.forEach((validator) => {
          const { activeSince, activeDuration } = getValidatorActiveInfo(
            validator.activationepoch,
          );

          validators.push({
            validatorIndex: validator.validatorindex,
            publicKey: validator.pubkey,
            withdrawalAddress: validator.withdrawalcredentials,
            balance: BigInt(validator.balance) * BigInt(10 ** 9),
            effectiveBalance:
              BigInt(validator.effectivebalance) * BigInt(10 ** 9),
            status: validator.status.toLowerCase().includes("active")
              ? ValidatorStatus.ACTIVE
              : ValidatorStatus.INACTIVE,
            numberOfWithdrawals: validator.total_withdrawals,
            activeSince,
            activeDuration,
            withdrawalTransaction: undefined,
            consolidationTransaction: undefined,
            depositTransaction: undefined,
          });
        });

        return validators;
      } catch (error) {
        console.error("Error fetching validators:", error);
        return [];
      }
    }),
});
