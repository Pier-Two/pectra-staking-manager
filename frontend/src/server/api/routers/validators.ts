import axios from "axios";
import { z } from "zod";

import { getBeaconChainURL } from "pec/constants/beaconchain";
import { env } from "pec/env";
import {
  ConsolidationModel,
  DepositModel,
  WithdrawalModel,
} from "pec/lib/database/models";
import { getValidatorActiveInfo } from "pec/lib/utils/validatorActivity";
import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import type {
  BeaconChainAllValidatorsResponse,
  BeaconChainValidatorDetailsResponse,
  BeaconChainValidatorArrayDetailsResponse,
} from "pec/types/api";
import { ACTIVE_STATUS } from "pec/types/app";
import {
  TransactionStatus,
  type ValidatorDetails,
  ValidatorStatus,
} from "pec/types/validator";

export const validatorRouter = createTRPCRouter({
  getValidators: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input: { address } }) => {
      try {
        const validators: ValidatorDetails[] = [];

        const validatorResponse =
          await axios.get<BeaconChainAllValidatorsResponse>(
            `${getBeaconChainURL()}api/v1/validator/withdrawalCredentials/${address}?apikey=${env.BEACONCHAIN_API_KEY}&limit=200`,
          );

        if (!validatorResponse.data || validatorResponse.data.data.length === 0)
          return [];

        const validatorIndexes = validatorResponse.data.data.map(
          (validator) => validator.validatorindex,
        );

        if (validatorIndexes.length === 0) return [];

        const validatorDetails =
          await axios.get<BeaconChainValidatorArrayDetailsResponse>(
            `${getBeaconChainURL()}/api/v1/validator/${validatorIndexes.join(",")}?apikey=${env.BEACONCHAIN_API_KEY}`,
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
            upgradeSubmitted: false,
          });
        });

        for (const validator of validators) {
          const [upgradeTx, consolidationTx, depositTx] = await Promise.all([
            await ConsolidationModel.findOne({
              targetValidatorIndex: validator.validatorIndex,
              sourceTargetValidatorIndex: validator.validatorIndex,
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

          if (upgradeTx) {
            validator.upgradeSubmitted = true;
          }

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

  getValidatorDetails: publicProcedure
    .input(z.object({ searchTerm: z.string() }))
    .query(async ({ input: { searchTerm } }) => {
      try {
        const { data } = await axios.get<BeaconChainValidatorDetailsResponse>(
          `${getBeaconChainURL()}/api/v1/validator/${searchTerm}?apikey=${env.BEACONCHAIN_API_KEY}`,
        );

        const validator = data.data;

        if (!validator.validatorindex) {
          return "NOT_FOUND";
        }

        const { activeSince, activeDuration } = getValidatorActiveInfo(
          validator.activationepoch,
        );

        const formattedValidator = {
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
        };

        return formattedValidator;
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
        status: ACTIVE_STATUS,
        txHash,
        user,
      });

      return {
        success: true,
        record: newRecord,
      };
    }),
});
