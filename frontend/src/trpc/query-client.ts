import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import type { TRPCClientError } from "@trpc/client";
import type { AppRouter } from "pec/server/api/root";
import { toast } from "pec/components/ui/Toast";
import SuperJSON from "superjson";

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
              toast({
                title: "Rate limit exceeded",
                description: "Please try again later.",
                variant: "error",
              });
            }
          }
        },
      },
    },
  });
