import { ChartContainer } from "pec/components/charts/ChartContainer";
import { ChartSkeleton } from "pec/components/charts/ChartSkeleton";
import { api, HydrateClient } from "pec/trpc/server";
import { Suspense } from "react";

const ChartPrefetch = async () => {
  await api.charts.getChartData.prefetch(); // used in ChartContainer.tsx

  return (
    <HydrateClient>
      <ChartContainer />
    </HydrateClient>
  );
};

export const ValidatorsChart = async () => {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <ChartPrefetch />
    </Suspense>
  );
};
