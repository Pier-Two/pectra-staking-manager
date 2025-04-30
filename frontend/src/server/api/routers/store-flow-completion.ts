import {
  createRedisRateLimiterMiddleware,
  createTRPCRouter,
  publicProcedure,
} from "pec/server/api/trpc";
import {
  ConsolidationModel,
  DepositModel,
  ValidatorUpgradeModel,
  WithdrawalModel,
} from "pec/lib/database/models";
import { StoreWithdrawalRequestSchema } from "pec/lib/api/schemas/withdrawal";
import { ACTIVE_STATUS } from "pec/types/app";
import { maxBy } from "lodash";
import type { IResponse } from "pec/types/response";
import { createContact } from "pec/lib/services/emailService";
import { Ratelimit } from "@upstash/ratelimit";
import { getWithdrawals } from "pec/server/helpers/beaconchain/getWithdrawals";
import { StoreDatabaseDepositSchema } from "pec/lib/api/schemas/deposit";
import { StoreConsolidationSchema } from "pec/lib/api/schemas/consolidation";
import { routeHandler } from "pec/server/helpers/route-errors";

export const storeFlowCompletion = createTRPCRouter({
  storeWithdrawalRequest: publicProcedure
    .meta({
      noRateLimit: true, // no rate limit since this is hit many times during withdrawal processing
    })
    .input(StoreWithdrawalRequestSchema)
    .mutation(async ({ input }) =>
      routeHandler(async (): Promise<IResponse<null>> => {
        const { network, validatorIndex, email, amount, txHash } = input;

        const response = await getWithdrawals([validatorIndex], network);

        if (!response.success) return response;

        const lastWithdrawal = maxBy(response.data, "withdrawalindex");
        const withdrawalIndex = lastWithdrawal?.withdrawalindex ?? 0;

        await WithdrawalModel.create({
          validatorIndex,
          email,
          withdrawalIndex,
          status: ACTIVE_STATUS,
          networkId: network,
          amount,
          txHash,
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
        // Each batched deposit request in the array will have the same email
        const email = input.email;

        await DepositModel.create(
          input.deposits.map((deposit) => ({
            ...deposit,
            status: ACTIVE_STATUS,
            email,
            networkId: input.network,
          })),
        );

        await createContact(email);

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
          sourceTargetValidatorIndex,
          txHash,
          email,
          network,
        },
      }) =>
        routeHandler(async (): Promise<IResponse<null>> => {
          if (targetValidatorIndex === sourceTargetValidatorIndex) {
            await ValidatorUpgradeModel.create({
              validatorIndex: targetValidatorIndex,
              email,
              status: ACTIVE_STATUS,
              networkId: network,
              txHash,
            });
          } else {
            await ConsolidationModel.create({
              targetValidatorIndex,
              sourceTargetValidatorIndex,
              status: ACTIVE_STATUS,
              txHash,
              email,
              networkId: network,
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
