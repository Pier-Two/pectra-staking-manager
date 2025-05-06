import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "pec/components/ui/chart";
import { useIsMobile } from "pec/hooks/use-mobile";
import { IBiaxialLineChart } from "pec/types/chart";
import { CartesianGrid, Label, Line, LineChart, XAxis, YAxis } from "recharts";
import { formatTick } from "./formatTick";
import { maxBy, minBy } from "lodash";
import { cn } from "pec/lib/utils";

const chartConfig = {
  avgEthStaked: {
    label: "Average ETH Staked",
    color: "hsl(var(--chart-1))",
  },
  totalValidatorCount: {
    label: "Total Validator Count",
    color: "hsl(var(--chart-2))",
  },
};

export const BiaxialLineChartComponent = ({ chart }: IBiaxialLineChart) => {
  const { chartData, yAxis, xAxis } = chart;

  const { label: yLabel, showLabel: showYLabel } = yAxis;

  const {
    label: xLabel,
    showLabel: showXLabel,
    orientation: xOrientation,
  } = xAxis;

  const isMobile = useIsMobile();
  return (
    <ChartContainer
      className="aspect-auto h-full w-full flex-1"
      config={chartConfig}
    >
      <LineChart data={chartData} className="h-full w-full">
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

        {!isMobile && (
          <YAxis
            yAxisId="left"
            allowDataOverflow={true}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatTick(+value)}
            orientation="left"
            domain={[
              32,
              (maxBy(chartData, "avgEthStaked")?.avgEthStaked ?? 32) * 1.1,
            ]}
          />
        )}

        {!isMobile && (
          <YAxis
            allowDataOverflow={true}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatTick(+value)}
            orientation="right"
            yAxisId="right"
          >
            {showYLabel && (
              <Label
                angle={90}
                value={yLabel}
                position={"insideRight"}
                style={{ textAnchor: "middle" }}
              />
            )}
          </YAxis>
        )}

        <Line
          dataKey="avgEthStaked"
          type="monotone"
          stroke={chartConfig.avgEthStaked.color}
          yAxisId={isMobile ? undefined : "left"}
        />

        <Line
          dataKey="totalValidatorCount"
          type="monotone"
          stroke={chartConfig.totalValidatorCount.color}
          yAxisId={isMobile ? undefined : "right"}
        />

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

        <ChartLegend
          className={cn(showXLabel ? "mt-4" : "", "ml-8")}
          content={<ChartLegendContent />}
        />
      </LineChart>
    </ChartContainer>
  );
};
