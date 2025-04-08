"use client";

import type { FC } from "react";
import { Area, AreaChart, CartesianGrid, Label, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "pec/components/ui/chart";
import type { IAreaChart } from "pec/types/chart";
import { useTheme } from "pec/hooks/useTheme";

const chartConfig = {
  pectra: {
    label: "0x02 (Pectra)",
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
    lowerRange,
    upperRange,
    ticks,
    label: yLabel,
    showLabel: showYLabel,
    orientation: yOrientation,
  } = yAxis;
  const {
    label: xLabel,
    showLabel: showXLabel,
    orientation: xOrientation,
  } = xAxis;

  const { darkMode } = useTheme();

  const axisTextStyle = {
    fill: darkMode ? "#ffffff" : "#000000",
    fontSize: 12,
  };

  return (
    <ChartContainer className="px-8" config={chartConfig}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="fillPectra" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={chartConfig.pectra.color}
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor={chartConfig.pectra.color}
              stopOpacity={0.1}
            />
          </linearGradient>

          <linearGradient id="fillShapella" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={chartConfig.shapella.color}
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor={chartConfig.shapella.color}
              stopOpacity={0.1}
            />
          </linearGradient>

          <linearGradient id="fillMerge" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={chartConfig.merge.color}
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor={chartConfig.merge.color}
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>

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
                  offset: xOrientation === "bottom" ? -20 : -20,
                }
              : undefined
          }
          minTickGap={32}
          tickFormatter={(value: string) => value.slice(0, 3)}
          tick={axisTextStyle}
          orientation={xOrientation}
        />

        <YAxis
          tickLine={false}
          axisLine={true}
          tickMargin={8}
          domain={[lowerRange, upperRange]}
          ticks={ticks}
          tick={axisTextStyle}
          orientation={yOrientation}
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
          dataKey="pectra"
          type="natural"
          fill="url(#fillPectra)"
          stroke={chartConfig.pectra.color}
          stackId="a"
        />

        <Area
          dataKey="shapella"
          type="natural"
          fill="url(#fillShapella)"
          stroke={chartConfig.shapella.color}
          stackId="b"
        />

        <Area
          dataKey="merge"
          type="natural"
          fill="url(#fillMerge)"
          stroke={chartConfig.merge.color}
          stackId="c"
        />

        {legend && (
          <ChartLegend className="mt-4" content={<ChartLegendContent />} />
        )}
      </AreaChart>
    </ChartContainer>
  );
};
