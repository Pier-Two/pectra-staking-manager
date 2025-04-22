import { ChartContainer } from "pec/components/charts/ChartContainer";
import { api, HydrateClient } from "pec/trpc/server";

export const ChartPrefetch = async () => {
  await api.charts.getChartData.prefetch(); // used in ChartContainer.tsx

  return (
    <HydrateClient>
      <ChartContainer />
    </HydrateClient>
  );
};
