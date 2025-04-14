import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import { storeWithdrawalRequest } from "./withdrawal";
import { storeDepositRequest } from "./deposit";

export const storeEmailRequestRouter = createTRPCRouter({
  storeWithdrawalRequest: publicProcedure
    .input(z.object({ validatorIndex: z.number() }))
    .query(({ input }) => {
      const { validatorIndex } = input;
      return storeWithdrawalRequest(validatorIndex);
    }),

  storeDepositRequest: publicProcedure
    .input(z.object({ validatorIndex: z.number(), txHash: z.string() }))
    .query(({ input }) => {
      const { validatorIndex, txHash } = input;
      return storeDepositRequest(validatorIndex, txHash);
    }),
});
