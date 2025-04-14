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
  TransactionStatus,
  type ValidatorDetails,
  ValidatorStatus,
} from "pec/types/validator";
import {
  ConsolidationModel,
  DepositModel,
  WithdrawalModel,
} from "pec/lib/database/models";
import { getBeaconChainURL } from "pec/constants/beaconchain";

export const validatorRouter = createTRPCRouter({
  getValidators: publicProcedure
    .input(
      z.object({ address: z.string(), isTestnet: z.boolean().default(true) }), // TODO actually use isTestnet in front end
    )
    .query(async ({ input: { address, isTestnet } }) => {
      try {
        const validators: ValidatorDetails[] = [];

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

        for (const validator of validators) {
          const [withdrawTx, consolidationTx, depositTx] = await Promise.all([
            await WithdrawalModel.findOne({
              validatorIndex: validator.validatorIndex,
            }),
            await ConsolidationModel.findOne({
              $or: [
                { targetValidatorIndex: Number(validator.validatorIndex) },
                {
                  sourceTargetValidatorIndex: Number(validator.validatorIndex),
                },
              ],
            }),
            await DepositModel.findOne({
              validatorIndex: validator.validatorIndex,
            }),
          ]);

          if (consolidationTx) {
            validator.consolidationTransaction = {
              hash: consolidationTx.txHash,
              status: TransactionStatus.SUBMITTED,
              isConsolidatedValidator:
                validator.validatorIndex ===
                consolidationTx?.targetValidatorIndex,
            };
          }

          if (depositTx) {
            validator.depositTransaction = {
              hash: depositTx.txHash,
              status: TransactionStatus.SUBMITTED,
            };
          }
        }

        return validators;
      } catch (error) {
        console.error("Error fetching validators:", error);
        return [];
      }
    }),

  updateConsolidationRecord: publicProcedure
    .input(
      z.object({
        targetValidatorIndex: z.number(),
        sourceTargetValidatorIndex: z.number(),
        txHash: z.string(),
        user: z.string().default("67f60c4f4ce6567f9f511b2f"), // TODO figure this out
      }),
    )
    .mutation(async ({ input }) => {
      const { targetValidatorIndex, sourceTargetValidatorIndex, txHash, user } =
        input;

      // Check if a record with these validator indexes already exists
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

      if (existingRecord) {
        throw new Error(
          `Consolidation record already exists for validators ${targetValidatorIndex} and ${sourceTargetValidatorIndex}`,
        );
      }

      // Create new consolidation record
      const newRecord = await ConsolidationModel.create({
        targetValidatorIndex,
        sourceTargetValidatorIndex,
        status: "ACTIVE",
        txHash,
        user,
      });

      return {
        success: true,
        record: newRecord,
      };
    }),
});
