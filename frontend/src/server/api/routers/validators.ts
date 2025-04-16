import { z } from "zod";
import { getValidatorActiveInfo } from "pec/lib/utils/validatorActivity";
import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import type {
  BeaconChainAllValidatorsResponse,
  BeaconChainValidatorArrayDetailsResponse,
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
import { ACTIVE_STATUS } from "pec/types/app";
import { SupportedChainIdSchema } from "pec/lib/api/schemas/network";
import { getBeaconChainAxios } from "pec/lib/server/axios";

export const validatorRouter = createTRPCRouter({
  getValidators: publicProcedure
    .input(z.object({ address: z.string(), chainId: SupportedChainIdSchema }))
    .query(async ({ input: { address, chainId: network } }) => {
      try {
        const validatorResponse = await getBeaconChainAxios(
          network,
        ).get<BeaconChainAllValidatorsResponse>(
          `/api/v1/validator/withdrawalCredentials/${address}`,
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

        const validators: ValidatorDetails[] = validatorDetails.data.data.map(
          (validator): ValidatorDetails => {
            const { activeSince, activeDuration } = getValidatorActiveInfo(
              validator.activationepoch,
            );

            return {
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
              withdrawalTransactions: [],
              consolidationTransaction: undefined,
              depositTransaction: undefined,
            };
          },
        );

        for (const validator of validators) {
          const [withdrawTx, consolidationTx, depositTx] = await Promise.all([
            await WithdrawalModel.find({
              validatorIndex: validator.validatorIndex,
            }).lean(),

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

          if (withdrawTx) {
            validator.withdrawalTransactions = withdrawTx;
          }
        }

        return validators;
      } catch (error) {
        console.error("Error fetching validators:", error);
        return [];
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

        if (!validator.validatorindex) {
          return "NOT_FOUND";
        }

        const { activeSince, activeDuration } = getValidatorActiveInfo(
          validator.activationepoch,
        );

        const formattedValidator: ValidatorDetails = {
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
          withdrawalTransactions: [],
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
        user,
      });

      return {
        success: true,
        record: newRecord,
      };
    }),
});
