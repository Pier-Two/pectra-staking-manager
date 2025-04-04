import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import {
  processConsolidations,
  storeConsolidationRequest,
} from "./consolidation";
import { processWithdrawals, storeWithdrawalRequest } from "./withdrawal";
import { processDeposits, storeDepositRequest } from "./deposit";

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
    .query(({ input }) => {
      const { validatorIndex, txHash } = input;
      return storeDepositRequest(validatorIndex, txHash);
    }),

  processDeposits: publicProcedure.query(async () => {
    return await processDeposits();
  }),

  // ! Leave this for now
  storeConsolidationRequest: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(({}) => {
      return storeConsolidationRequest();
    }),

  processConsolidations: publicProcedure.query(async () => {
    return await processConsolidations();
  }),
});
