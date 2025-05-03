import {
  createRedisRateLimiterMiddleware,
  createTRPCRouter,
  publicProcedure,
} from "pec/server/api/trpc";
import {
  ConsolidationModel,
  DepositModel,
  ExitModel,
  ValidatorUpgradeModel,
  WithdrawalModel,
} from "pec/server/database/models";
import { StoreWithdrawalRequestSchema } from "pec/lib/api/schemas/withdrawal";
import { ACTIVE_STATUS } from "pec/types/app";
import type { IResponse } from "pec/types/response";
import { createContact } from "pec/server/helpers/emails/emailService";
import { Ratelimit } from "@upstash/ratelimit";
import { StoreDatabaseDepositSchema } from "pec/lib/api/schemas/deposit";
import { StoreConsolidationSchema } from "pec/lib/api/schemas/consolidation";
import { routeHandler } from "pec/server/helpers/route-errors";

export const storeFlowCompletion = createTRPCRouter({
  storeWithdrawalRequest: publicProcedure
    .meta({
      noRateLimit: true, // no rate limit since this is hit many times during withdrawal processing
    })
    .input(StoreWithdrawalRequestSchema)
    .mutation(
      async ({
        input: {
          network,
          validatorIndex,
          email,
          amount,
          txHash,
          balance,
          withdrawalAddress,
        },
      }) =>
        routeHandler(async (): Promise<IResponse<null>> => {
          if (amount === balance) {
            await ExitModel.create({
              status: ACTIVE_STATUS,

              withdrawalAddress,
              validatorIndex,
              txHash,
              networkId: network,
              amount,
              email,
            });

            await createContact(email);

            return {
              success: true,
              data: null,
            };
          }

          await WithdrawalModel.create({
            status: ACTIVE_STATUS,

            validatorIndex,
            withdrawalAddress,
            txHash,
            networkId: network,
            amount,
            email,
          });

          await createContact(email);

          return {
            success: true,
            data: null,
          };
        }),
    ),

  storeDepositRequest: publicProcedure
    // stricter rate limit for deposit requests
    .use(createRedisRateLimiterMiddleware(Ratelimit.slidingWindow(10, "60 s")))
    .input(StoreDatabaseDepositSchema)
    .mutation(async ({ input }) =>
      routeHandler(async (): Promise<IResponse<null>> => {
        await DepositModel.create({
          status: ACTIVE_STATUS,

          deposits: input.deposits,
          txHash: input.txHash,
          withdrawalAddress: input.withdrawalAddress,
          email: input.email,
          networkId: input.networkId,
        });

        await createContact(input.email);

        return {
          success: true,
          data: null,
        };
      }),
    ),
  storeConsolidationRequest: publicProcedure
    .meta({
      noRateLimit: true, // no rate limit since this is hit many times during consolidation
    })
    .input(StoreConsolidationSchema)
    .mutation(
      async ({
        input: {
          targetValidatorIndex,
          sourceValidatorIndex,
          txHash,
          email,
          network,
          amount,
        },
      }) =>
        routeHandler(async (): Promise<IResponse<null>> => {
          if (targetValidatorIndex === sourceValidatorIndex) {
            await ValidatorUpgradeModel.create({
              status: ACTIVE_STATUS,

              validatorIndex: targetValidatorIndex,
              txHash,
              networkId: network,
              email,
            });
          } else {
            await ConsolidationModel.create({
              status: ACTIVE_STATUS,

              targetValidatorIndex,
              sourceValidatorIndex,
              txHash,
              networkId: network,
              amount,
              email,
            });
          }

          await createContact(email);

          return {
            success: true,
            data: null,
          };
        }),
    ),
});
