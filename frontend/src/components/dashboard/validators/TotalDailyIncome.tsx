import type { FC } from "react";
import { MyValidatorsCard } from "./MyValidatorsCard";
import { DECIMAL_PLACES } from "pec/lib/constants";
import { formatUnits } from "viem";
import { displayedEthAmount } from "pec/lib/utils/validators/balance";

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
  const displayEth = displayedEthAmount(totalInEth);

  return (
    <MyValidatorsCard
      title="Total Daily Income"
      body={<p>Ξ {displayEth}</p>}
      subtext={`Earning $${totalInUsd.toFixed(DECIMAL_PLACES)} per day`}
    />
  );
};
