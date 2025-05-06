"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "pec/components/ui/chart";
import { useIsMobile } from "pec/hooks/use-mobile";

import { cn } from "pec/lib/utils";
import type { IAreaChart } from "pec/types/chart";
import type { FC } from "react";
import { Area, AreaChart, CartesianGrid, Label, XAxis, YAxis } from "recharts";
import { formatTick } from "./formatTick";

const chartConfig = {
  pectra: {
    label: "Type 2 (Pectra)",
    color: "hsl(var(--chart-3))",
  },
  shapella: {
    label: "Type 1 (Shapella)",
    color: "hsl(var(--chart-2))",
  },
  merge: {
    label: "Type 0 (Merge)",
    color: "hsl(var(--chart-1))",
  },
};

export const AreaChartComponent: FC<IAreaChart> = ({ chart }) => {
  const { chartData, yAxis, legend, xAxis } = chart;
  const {
    label: yLabel,
    showLabel: showYLabel,
    orientation: yOrientation,
    width: yWidth,
  } = yAxis;

  const {
    label: xLabel,
    showLabel: showXLabel,
    orientation: xOrientation,
  } = xAxis;

  return (
    <ChartContainer
      className="aspect-auto h-full w-full flex-1"
      config={chartConfig}
    >
      <AreaChart data={chartData} className="h-full w-full">
        <CartesianGrid vertical={false} horizontal={true} />

        <XAxis
          dataKey="key"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          label={
            showXLabel
              ? {
                  value: xLabel,
                  position:
                    xOrientation === "top" ? "insideTop" : "insideBottom",
                  offset: -15,
                }
              : undefined
          }
          minTickGap={32}
          orientation={xOrientation}
          className="max-sm:minTickGap-48"
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatTick(+value)}
          orientation={yOrientation}
          width={yWidth}
        >
          {showYLabel && (
            <Label
              angle={yOrientation === "left" ? -90 : 90}
              value={yLabel}
              position={yOrientation === "left" ? "insideLeft" : "insideRight"}
              style={{ textAnchor: "middle" }}
            />
          )}
        </YAxis>

        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              className="rounded-xl border border-gray-200 bg-white p-4 text-black dark:border-gray-800 dark:bg-gray-900 dark:text-white"
              labelFormatter={(value: string) => value}
              indicator="dot"
            />
          }
        />

        <Area
          dataKey="merge"
          type="monotone"
          fill={chartConfig.merge.color}
          stroke={chartConfig.merge.color}
          stackId="1"
        />

        <Area
          dataKey="shapella"
          type="monotone"
          fill={chartConfig.shapella.color}
          stroke={chartConfig.shapella.color}
          stackId="1"
        />

        <Area
          dataKey="pectra"
          type="monotone"
          fill={chartConfig.pectra.color}
          stroke={chartConfig.pectra.color}
          stackId="1"
        />

        {legend && (
          <ChartLegend
            className={cn(showXLabel ? "mt-4" : "", "ml-8")}
            content={<ChartLegendContent />}
          />
        )}
      </AreaChart>
    </ChartContainer>
  );
};
