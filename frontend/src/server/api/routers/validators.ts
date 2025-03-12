import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import { MOCK_VALIDATORS } from "pec/server/__mocks__/validators";

export const validatorRouter = createTRPCRouter({
  getValidators: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(({ }) => {
      return MOCK_VALIDATORS;
    }),
});
