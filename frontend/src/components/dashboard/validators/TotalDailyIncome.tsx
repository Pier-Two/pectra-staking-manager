import type { FC } from "react";
import { MyValidatorsCard } from "./MyValidatorsCard";
import { DECIMAL_PLACES } from "pec/lib/constants";
import { formatUnits } from "viem";

interface ITotalDailyIncome {
  validatorPerformanceInGwei: number;
  ethPrice: number;
}

export const TotalDailyIncome: FC<ITotalDailyIncome> = ({
  validatorPerformanceInGwei,
  ethPrice,
}) => {
  const totalInEth = parseFloat(
    formatUnits(BigInt(validatorPerformanceInGwei), 9),
  );
  const totalInUsd = totalInEth * ethPrice;

  return (
    <MyValidatorsCard
      title="Total Daily Income"
      body={<p>Ξ {totalInEth.toFixed(DECIMAL_PLACES)}</p>}
      subtext={`Earning $${totalInUsd.toFixed(2)} per day`}
    />
  );
};
