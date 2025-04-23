import { z } from "zod";
import { getValidatorActiveInfo } from "pec/lib/utils/validatorActivity";
import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import type {
  BeaconChainAllValidatorsResponse,
  BeaconChainValidatorArrayDetailsResponse,
  BeaconChainValidatorDetailsResponse,
  BeaconChainValidatorPerformanceResponse,
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
import { createContact } from "pec/lib/services/emailService";

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
              upgradeSubmitted: false,
            };
          },
        );

        for (const validator of validators) {
          const [withdrawTx, upgradeTx, consolidationTx, depositTx] =
            await Promise.all([
              await WithdrawalModel.find({
                validatorIndex: validator.validatorIndex,
              }),
              await ConsolidationModel.findOne({
                targetValidatorIndex: validator.validatorIndex,
                sourceTargetValidatorIndex: validator.validatorIndex,
              }),
              // TODO make this exclusive OR?
              await ConsolidationModel.findOne({
                $or: [
                  { targetValidatorIndex: Number(validator.validatorIndex) },
                  {
                    sourceTargetValidatorIndex: Number(
                      validator.validatorIndex,
                    ),
                  },
                ],
              }),
              await DepositModel.findOne({
                validatorIndex: validator.validatorIndex,
              }),
            ]);

          if (withdrawTx) {
            validator.withdrawalTransactions = withdrawTx;
          }

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

    getValidatorsPerformanceInWei: publicProcedure
    .input(
      z.object({
        address: z.string(),
        chainId: SupportedChainIdSchema,
        filter: z.enum(["daily", "weekly", "monthly", "yearly", "overall"]),
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
          switch (filter) {
            case "daily":
              totalInWei += validatorPerformance.performance1d ?? 0;
              break;

            case "weekly":
              totalInWei += validatorPerformance.performance7d ?? 0;
              break;

            case "monthly":
              totalInWei += validatorPerformance.performance31d ?? 0;
              break;

            case "yearly":
              totalInWei += validatorPerformance.performance365d ?? 0;
              break;

            case "overall":
              totalInWei += validatorPerformance.performanceTotal ?? 0;
              break;

            default:
              totalInWei += validatorPerformance.performance1d ?? 0;
              break;
          }
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
          upgradeSubmitted: false,
          withdrawalTransactions: [],
        };

        const upgradeTx = await ConsolidationModel.findOne({
          targetValidatorIndex: formattedValidator.validatorIndex,
          sourceTargetValidatorIndex: formattedValidator.validatorIndex,
        });

        if (upgradeTx) {
          formattedValidator.upgradeSubmitted = true;
        }

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
