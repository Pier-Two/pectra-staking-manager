export interface IChartContainer {
  charts: IChart[];
  filter: "days" | "months" | "years";
  setFilter: (filter: "days" | "months" | "years") => void;
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

export interface IChartData {
  key: string;
  merge?: number;
  shapella?: number;
  pectra: number;
}

export interface IXAxis {
  label: string;
  showLabel: boolean;
  orientation: "top" | "bottom";
}

export interface IYAxis {
  lowerRange: number;
  upperRange: number;
  ticks: number[];
  label: string;
  showLabel: boolean;
  orientation: "left" | "right";
}

//API
export type ChartGroup = {
  key: string;
  data: IChart[];
};

export type ValidatorStatistics = {
  avgStaked: number;
  count: number;
  totalStaked: number;
  withdrawalCredentialPrefix: string;
  timestamp: string;
};

export type IGroupedValidatorStatistics = Record<
  string,
  {
    avgStaked: string;
    count: number;
    totalStaked: string;
    withdrawalCredentialPrefix: string;
    timestamp: Date;
  }[]
>;
