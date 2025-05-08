import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import { generateChartData } from "./generateChartData";
import { redis } from "pec/lib/utils/redis";
import type { IChart } from "pec/types/chart";

export const chartRouter = createTRPCRouter({
  getChartData: publicProcedure.query(async () => {
    // get the cached data from the custom redis cache
    const cachedChartData = await redis.get<IChart[]>(
      "pectra-cache:chart-data-v1.4",
    );

    // if the data is cached, return it
    if (cachedChartData && cachedChartData.length > 0) {
      return cachedChartData;
    }

    // if the data is not cached, generate it
    return generateChartData();
  }),
});
