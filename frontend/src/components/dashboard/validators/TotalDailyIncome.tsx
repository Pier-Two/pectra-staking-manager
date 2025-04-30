"use client";

import { MyValidatorsCard } from "./MyValidatorsCard";
import { DECIMAL_PLACES } from "pec/lib/constants";
import { formatUnits } from "viem";
import { displayedEthAmount } from "pec/lib/utils/validators/balance";
import { Skeleton } from "pec/components/ui/skeleton";
import { useValidatorPerformance } from "pec/hooks/useValidatorPerformance";
import { useEthPrice } from "pec/hooks/useEthPrice";
import { dashboardAnimationDelays } from "pec/constants/animationDelays";

export const TotalDailyIncome = () => {
  const { data: ethPrice, isSuccess: isEthPriceSuccessful } = useEthPrice(
    "ETH",
    "USD",
  );

  const {
    data: validatorPerformanceInWei,
    isSuccess: isPerformanceSuccessful,
  } = useValidatorPerformance("daily");

  if (
    !(
      isEthPriceSuccessful &&
      isPerformanceSuccessful &&
      ethPrice &&
      validatorPerformanceInWei
    )
  )
    return <TotalDailyIncomeLoading />;

  const totalInEth = parseFloat(
    formatUnits(BigInt(validatorPerformanceInWei), 18),
  );
  const totalInUsd = totalInEth * ethPrice;
  const displayEth = displayedEthAmount(totalInEth);

  return (
    <MyValidatorsCard
      layoutId="total-daily-income-card"
      delay={dashboardAnimationDelays.totalDailyIncome}
      title="Total Daily Income"
      body={<p>Ξ {displayEth}</p>}
      subtext={`Earning $${totalInUsd.toFixed(DECIMAL_PLACES)} per day`}
    />
  );
};

export const TotalDailyIncomeLoading = () => (
  <MyValidatorsCard
    isLoading
    layoutId="total-daily-income-card"
    delay={dashboardAnimationDelays.totalDailyIncome}
    title="Total Daily Income"
    body={
      <div className="flex flex-row items-center gap-x-2">
        <span>Ξ</span>
        <Skeleton className="h-8 w-16 bg-slate-50" />
      </div>
    }
    subtext={
      <div className="flex flex-row items-center gap-x-2">
        <span>Earning</span>
        <Skeleton className="mt-1 h-3 w-12 bg-slate-50" />
        <span>per day</span>
      </div>
    }
  />
);
