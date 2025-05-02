"use client";

import { useTheme } from "next-themes";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "pec/components/ui/chart";

import { cn } from "pec/lib/utils";
import type { IAreaChart } from "pec/types/chart";
import type { FC } from "react";
import { Area, AreaChart, CartesianGrid, Label, XAxis, YAxis } from "recharts";

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

export const AreaChartComponent: FC<IAreaChart> = ({ chart, isFullscreen }) => {
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

  const { resolvedTheme: theme } = useTheme();

  const axisTextStyle = {
    stroke: theme === "dark" ? "#e3e3e3" : "#a1a1a1",
    fontSize: window.innerWidth < 500 ? "7px" : "11px",
    fontWeight: 180,
  };

  const formatTick = (value: number): string => {
    const abs = Math.abs(value);
    const format = (val: number, suffix: string) =>
      parseFloat(val.toFixed(2)).toString() + suffix;

    if (abs >= 1e12) return format(value / 1e12, "t");
    if (abs >= 1e9) return format(value / 1e9, "bn");
    if (abs >= 1e6) return format(value / 1e6, "m");
    if (abs >= 1e3) return format(value / 1e3, "k");
    if (abs === 0) return "0";

    if (abs < 100 && abs > 0.1) return value.toFixed(4);
    return value.toFixed(2);
  };

  return (
    <ChartContainer
      className={cn(
        "mx-auto mb-8 w-full max-w-[800px]",
        isFullscreen && "max-w-none",
      )}
      config={chartConfig}
    >
      <AreaChart
        data={chartData}
        margin={{
          top: 4,
          right: window.innerWidth < 700 ? 25 : 50,
          left: window.innerWidth < 700 ? 0 : 10,
          bottom: isFullscreen ? 200 : -6,
        }}
        width={
          typeof window !== "undefined"
            ? isFullscreen
              ? window.innerWidth - 40
              : Math.min(window.innerWidth - 40, 800)
            : 800
        }
        height={isFullscreen ? 400 : 300}
        className="w-full"
      >
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
                  offset: -15,
                }
              : undefined
          }
          minTickGap={32}
          tick={axisTextStyle}
          orientation={xOrientation}
          className="max-sm:minTickGap-48"
        />

        <YAxis
          allowDataOverflow={true}
          tickLine={false}
          axisLine={false}
          domain={[lowerRange, upperRange]}
          ticks={ticks}
          tick={axisTextStyle}
          tickFormatter={(value) => formatTick(+value)}
          orientation={yOrientation}
          interval={0}
          className="max-sm:width-40"
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
          <ChartLegend
            className={cn(showXLabel ? "mt-4" : "", "ml-8")}
            content={<ChartLegendContent />}
          />
        )}
      </AreaChart>
    </ChartContainer>
  );
};
