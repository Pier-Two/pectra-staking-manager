import { createCallerFactory, createTRPCRouter } from "pec/server/api/trpc";
import { validatorRouter } from "./routers/validators";
import { storeFlowCompletion } from "./routers/store-flow-completion";
import { chartRouter } from "./routers/charts";
import { pricingRouter } from "./routers/pricing";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  validators: validatorRouter,
  pricing: pricingRouter,
  storeFlowCompletion: storeFlowCompletion,
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
