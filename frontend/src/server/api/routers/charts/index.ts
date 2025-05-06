import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import { generateChartData } from "./generateChartData";
import { redis } from "pec/lib/utils/redis";
import type { IChart } from "pec/types/chart";

export const chartRouter = createTRPCRouter({
  getChartData: publicProcedure.query(async () => {
    // get the cached data from the custom redis cache
    const cachedChartData = await redis.get<
      {
        key: string;
        data: IChart[];
      }[]
    >("pectra-cache:chart-data");

    // if the data is cached, return it
    if (cachedChartData) {
      return cachedChartData;
    }

    // if the data is not cached, generate it
    return generateChartData();
  }),
});
