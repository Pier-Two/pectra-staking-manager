import type { IChart } from "pec/types/chart";
import { ChartContainer } from "pec/components/charts/ChartContainer";
import ChartLoading from "./loading";

const ChartsPage = () => {
  const apiResponse: IChart[] = [
    {
      title: "Pectra Adoption Statistics",
      legend: true,
      footer:
        "Since Pectra launced 5 days ago, 15% of validators have adopted the Type 2 standard.",
      chartData: [
        { key: "January", merge: 55, shapella: 45, pectra: 0 },
        { key: "February", merge: 45, shapella: 55, pectra: 0 },
        { key: "March", merge: 20, shapella: 80, pectra: 0 },
        { key: "April", merge: 10, shapella: 90, pectra: 0.0 },
        { key: "May", merge: 4, shapella: 94, pectra: 2 },
        { key: "June", merge: 2, shapella: 78, pectra: 20 },
        { key: "July", merge: 0, shapella: 50, pectra: 50 },
        { key: "August", merge: 0, shapella: 25, pectra: 75 },
      ],
      yAxis: {
        lowerRange: 0,
        upperRange: 100,
        ticks: [0, 25, 50, 75, 100],
        label: "Network Percentage",
        showLabel: false,
        orientation: "left",
      },
      xAxis: {
        label: "Month",
        showLabel: false,
        orientation: "bottom",
      },
    },
    {
      title: "Chart 2",
      legend: false,
      footer: "",
      chartData: [
        { key: "January", merge: 100, shapella: 0, pectra: 0 },
        { key: "February", merge: 90, shapella: 10, pectra: 0 },
        { key: "March", merge: 80, shapella: 20, pectra: 0 },
        { key: "April", merge: 70, shapella: 30, pectra: 0.0 },
        { key: "May", merge: 60, shapella: 40, pectra: 0 },
        { key: "June", merge: 50, shapella: 50, pectra: 0 },
        { key: "July", merge: 40, shapella: 60, pectra: 0 },
        { key: "August", merge: 30, shapella: 70, pectra: 0 },
      ],
      yAxis: {
        lowerRange: 0,
        upperRange: 100,
        ticks: [0, 25, 50, 75, 100],
        label: "Network Percentage",
        showLabel: false,
        orientation: "left",
      },
      xAxis: {
        label: "Month",
        showLabel: false,
        orientation: "bottom",
      },
    },
  ];

  if (!apiResponse) return <ChartLoading />;

  return (
    <div className="flex w-full flex-col items-center dark:text-white">
      <div className="flex flex-col w-[55vw] space-y-10 p-10">
        <div className="space-y-2">
          <div className="flex items-center justify-center text-2xl font-medium">
            Ethereum&apos;s Pectra Upgrade
          </div>

          <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            Visualise Ethereum&apos;s greatest ever validator upgrade.
          </div>
        </div>

        <ChartContainer charts={apiResponse} />
      </div>
    </div>
  );
};

export default ChartsPage;
