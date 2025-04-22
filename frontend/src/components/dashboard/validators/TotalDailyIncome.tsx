import type { FC } from "react";
import { MyValidatorsCard } from "./MyValidatorsCard";
import { DECIMAL_PLACES } from "pec/lib/constants";

interface ITotalDailyIncome {
  performanceData: {
    totalInEth: number;
    totalInUsd: number;
  };
}

export const TotalDailyIncome: FC<ITotalDailyIncome> = ({
  performanceData,
}) => {
  const { totalInEth, totalInUsd } = performanceData;
  return (
    <MyValidatorsCard
      title="Total Daily Income"
      body={<p>Ξ {totalInEth.toFixed(DECIMAL_PLACES)}</p>}
      subtext={`Earning $${totalInUsd.toFixed(2)} per day`}
    />
  );
};
