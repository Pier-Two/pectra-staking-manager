import { createCallerFactory, createTRPCRouter } from "pec/server/api/trpc";

import { chartRouter } from "./routers/charts";
import { pricingRouter } from "./routers/pricing";
import { storeEmailRequestRouter } from "./routers/store-email-request/router";
import { validatorRouter } from "./routers/validators";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  validators: validatorRouter,
  pricing: pricingRouter,
  storeEmailRequest: storeEmailRequestRouter,
  charts: chartRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
