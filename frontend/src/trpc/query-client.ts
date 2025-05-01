import type { TRPCClientError } from "@trpc/client";
import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import SuperJSON from "superjson";

import type { AppRouter } from "pec/server/api/root";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
      mutations: {
        onError: (error: unknown) => {
          if (error instanceof Error && "data" in error) {
            const trpcError = error as TRPCClientError<AppRouter>;
            if (trpcError.data?.code === "TOO_MANY_REQUESTS") {
              toast.error("Rate limit exceeded. Please try again later.");
            }
          }
        },
      },
    },
  });
