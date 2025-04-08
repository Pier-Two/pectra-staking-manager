export interface IChartContainer {
  charts: IChart[];
}

export interface IAreaChart {
    chart: IChart;
}

export interface IChart {
  title: string;
  chartData: IChartData[];
  yAxis: IYAxis;
  xAxis: IXAxis;
  legend: boolean;
  footer: string;
}

interface IChartData {
  key: string;
  merge: number;
  shapella: number;
  pectra: number;
}

interface IXAxis {
  label: string;
  showLabel: boolean;
  orientation: "top" | "bottom";
}

interface IYAxis {
  lowerRange: number;
  upperRange: number;
  ticks: number[];
  label: string;
  showLabel: boolean;
  orientation: "left" | "right";
}
