import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import { storeDepositRequest } from "./deposit";
import { SupportedChainIdSchema } from "pec/lib/api/schemas/network";
import { WithdrawalModel } from "pec/lib/database/models";
import { getBeaconChainAxios } from "pec/lib/server/axios";
import {
  BeaconchainWithdrawalResponse,
  isBeaconchainWithdrawalResponseValid,
} from "pec/lib/api/schemas/beaconchain";
import { StoreWithdrawalRequestSchema } from "pec/lib/api/schemas/withdrawal";
import { ACTIVE_STATUS } from "pec/types/app";
import { maxBy } from "lodash";
import { IResponse } from "pec/types/response";
import { generateErrorResponse } from "pec/lib/utils";
import { getLoggedInUserOrCreate } from "pec/lib/server/user";

export const storeEmailRequestRouter = createTRPCRouter({
  storeWithdrawalRequest: publicProcedure
    .input(
      z.object({
        requestData: StoreWithdrawalRequestSchema,
        network: SupportedChainIdSchema,
      }),
    )
    .mutation(async ({ input }): Promise<IResponse<null>> => {
      const { requestData, network } = input;

      try {
        const userResponse = await getLoggedInUserOrCreate();
        if (!userResponse.success) return userResponse;

        const response = await getBeaconChainAxios(
          network,
        ).get<BeaconchainWithdrawalResponse>(
          `/api/v1/validator/${requestData.validatorIndex}/withdrawals`,
        );

        if (!isBeaconchainWithdrawalResponseValid(response)) {
          await WithdrawalModel.create({
            ...requestData,
            withdrawalIndex: 0,
            user: userResponse.data,
            status: ACTIVE_STATUS,
          });

          console.error(
            `Invalid response from BeaconChain API: ${response.status}`,
          );
          return {
            success: true,
            data: null,
          };
        }

        const lastWithdrawal = maxBy(response.data.data, "withdrawalindex");

        await WithdrawalModel.create({
          ...requestData,
          withdrawalIndex: lastWithdrawal?.withdrawalindex ?? 0,
          user: userResponse.data,
          status: ACTIVE_STATUS,
        });

        return {
          success: true,
          data: null,
        };
      } catch (error) {
        return generateErrorResponse(error);
      }
    }),

  storeDepositRequest: publicProcedure
    .input(z.object({ validatorIndex: z.number(), txHash: z.string() }))
    .mutation(({ input }) => {
      const { validatorIndex, txHash } = input;
      return storeDepositRequest(validatorIndex, txHash);
    }),
});
