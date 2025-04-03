import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import { MOCK_VALIDATORS } from "pec/server/__mocks__/validators";
import { storeConsolidationRequest } from "./consolidation";
import { processWithdrawals, storeWithdrawalRequest } from "./withdrawal";

export const storeEmailRequestRouter = createTRPCRouter({
  storeWithdrawalRequest: publicProcedure
    .input(z.object({ validatorIndex: z.number() }))
    .query(({ input }) => {
      const { validatorIndex } = input;
      return storeWithdrawalRequest(validatorIndex);
    }),

  processWithdrawals: publicProcedure.query(async () => {
    return await processWithdrawals();
  }),

  storeDepositRequest: publicProcedure
    .input(z.object({ validatorIndex: z.number(), txHash: z.string() }))
    .query(({}) => {
      // await DepositModel.create({
      //   data: {
      //     validatorIndex,
      //     txHash,
      //   },
      // });
      return MOCK_VALIDATORS;
    }),

  // ! Leave this for now
  storeConsolidationRequest: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(({}) => {
      return storeConsolidationRequest();
    }),
});
