import { z } from "zod";
import {
  createRedisRateLimiterMiddleware,
  createTRPCRouter,
  publicProcedure,
} from "pec/server/api/trpc";
import { SupportedChainIdSchema } from "pec/lib/api/schemas/network";
import {
  ConsolidationModel,
  DepositModel,
  WithdrawalModel,
} from "pec/lib/database/models";
import { StoreWithdrawalRequestSchema } from "pec/lib/api/schemas/withdrawal";
import { ACTIVE_STATUS } from "pec/types/app";
import { maxBy } from "lodash";
import type { IResponse } from "pec/types/response";
import { generateErrorResponse } from "pec/lib/utils";
import { DatabaseDepositSchema } from "pec/lib/api/schemas/database/deposit";
import { createContact } from "pec/lib/services/emailService";
import { Ratelimit } from "@upstash/ratelimit";
import { EmailSchema } from "pec/lib/api/schemas/email";
import { getWithdrawals } from "pec/server/helpers/beaconchain/getWithdrawals";

export const storeEmailRequestRouter = createTRPCRouter({
  storeWithdrawalRequest: publicProcedure
    .meta({
      noRateLimit: true, // no rate limit since this is hit many times during withdrawal processing
    })
    .input(
      z.object({
        requestData: StoreWithdrawalRequestSchema,
        network: SupportedChainIdSchema,
      }),
    )
    .mutation(async ({ input }): Promise<IResponse<null>> => {
      const { requestData, network } = input;

      try {
        const response = await getWithdrawals(
          requestData.validatorIndex,
          network,
        );

        if (!response.success) {
          console.error(
            `Error fetching withdrawals from BeaconChain API: ${response.error}`,
          );
          return generateErrorResponse(response.error);
        }

        const lastWithdrawal = maxBy(response.data, "withdrawalindex");
        const withdrawalIndex = lastWithdrawal?.withdrawalindex ?? 0;

        await WithdrawalModel.create({
          ...requestData,
          withdrawalIndex,
          status: ACTIVE_STATUS,
        });

        if (requestData.email) {
          const contactResponse = await createContact(requestData.email);

          if (!contactResponse.success)
            console.error(
              `Error creating contact in Hubspot for ${requestData.email}`,
              contactResponse.error,
            );
        }

        return {
          success: true,
          data: null,
        };
      } catch (error) {
        return generateErrorResponse(error);
      }
    }),

  storeDepositRequest: publicProcedure
    // stricter rate limit for deposit requests
    .use(createRedisRateLimiterMiddleware(Ratelimit.slidingWindow(10, "60 s")))
    .input(DatabaseDepositSchema.omit({ status: true }).array())
    .mutation(async ({ input }): Promise<IResponse<null>> => {
      try {
        // Each batched deposit request in the array will have the same email
        const email = input[0]?.email;

        await DepositModel.create(
          input.map((deposit) => ({ ...deposit, status: ACTIVE_STATUS })),
        );

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
          data: null,
        };
      } catch (error) {
        console.log(error);
        return generateErrorResponse(error);
      }
    }),
  storeConsolidationRequest: publicProcedure
    .meta({
      noRateLimit: true, // no rate limit since this is hit many times during consolidation
    })
    .input(
      z.object({
        targetValidatorIndex: z.number(),
        sourceTargetValidatorIndex: z.number(),
        txHash: z.string(),
        email: EmailSchema,
      }),
    )
    .mutation(async ({ input }): Promise<IResponse<null>> => {
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

      await ConsolidationModel.create({
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
        data: null,
      };
    }),
});
