import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import { SupportedChainIdSchema } from "pec/lib/api/schemas/network";
import { DepositModel, WithdrawalModel } from "pec/lib/database/models";
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
import { DatabaseDepositSchema } from "pec/lib/api/schemas/database/deposit";

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

        const beaconchainResonseValid =
          isBeaconchainWithdrawalResponseValid(response);

        let withdrawalIndex = 0;
        if (beaconchainResonseValid) {
          const lastWithdrawal = maxBy(response.data.data, "withdrawalindex");

          withdrawalIndex = lastWithdrawal?.withdrawalindex ?? 0;
        } else {
          console.error(
            `Invalid response from BeaconChain API: ${response.status}`,
          );
        }

        await WithdrawalModel.create({
          ...requestData,
          withdrawalIndex,
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
    .input(DatabaseDepositSchema.omit({ status: true }).array())
    .mutation(async ({ input }) => {
      try {
        await DepositModel.create([{ ...input }]);
      } catch (error) {
        return generateErrorResponse(error);
      }
    }),
});
