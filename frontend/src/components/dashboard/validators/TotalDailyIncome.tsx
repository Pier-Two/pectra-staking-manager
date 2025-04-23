import type { FC } from "react";
import { MyValidatorsCard } from "./MyValidatorsCard";
import { DECIMAL_PLACES, DECIMAL_PLACES_ETH } from "pec/lib/constants";
import { formatUnits } from "viem";

interface ITotalDailyIncome {
  validatorPerformanceInWei: number;
  ethPrice: number;
}

export const TotalDailyIncome: FC<ITotalDailyIncome> = ({
  validatorPerformanceInWei,
  ethPrice,
}) => {
  const totalInEth = parseFloat(
    formatUnits(BigInt(validatorPerformanceInWei), 18),
  );
  const totalInUsd = totalInEth * ethPrice;

  return (
    <MyValidatorsCard
      title="Total Daily Income"
      body={<p>Ξ {totalInEth.toFixed(DECIMAL_PLACES_ETH)}</p>}
      subtext={`Earning $${totalInUsd.toFixed(DECIMAL_PLACES)} per day`}
    />
  );
};
