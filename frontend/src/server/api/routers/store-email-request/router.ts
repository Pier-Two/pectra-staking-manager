import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import { storeWithdrawalRequest } from "./withdrawal";
import { storeDepositRequest } from "./deposit";
import { SupportedNetworkSchema } from "pec/lib/api/schemas/network";

export const storeEmailRequestRouter = createTRPCRouter({
  storeWithdrawalRequest: publicProcedure
    .input(
      z.object({
        validatorIndex: z.number(),
        network: SupportedNetworkSchema,
      }),
    )
    .query(({ input }) => {
      const { validatorIndex, network } = input;
      return storeWithdrawalRequest(validatorIndex, network);
    }),

  storeDepositRequest: publicProcedure
    .input(z.object({ validatorIndex: z.number(), txHash: z.string() }))
    .query(({ input }) => {
      const { validatorIndex, txHash } = input;
      return storeDepositRequest(validatorIndex, txHash);
    }),
});
