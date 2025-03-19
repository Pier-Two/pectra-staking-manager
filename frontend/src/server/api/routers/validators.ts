import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import { MOCK_VALIDATORS } from "pec/server/__mocks__/validators";
import { env } from "pec/env";

export const validatorRouter = createTRPCRouter({
  getValidators: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input: { address } }) => {
      const validators = await fetch(
        `https://beaconcha.in/api/v1/validator/eth1/${address}?api_key=${env.BEACONCHAIN_API_KEY}`,
      );
      // fetch("https://api.thirdweb.com/validators")https://nextjs.org/docs/messages/next-config-error;
      return MOCK_VALIDATORS;
    }),
});
