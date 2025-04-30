"use client";

import { useValidators } from "pec/hooks/useValidators";
import { MyValidatorsCard, MyValidatorsCardLoading } from "./MyValidatorsCard";
import { displayedEthAmount } from "pec/lib/utils/validators/balance";
import { Skeleton } from "pec/components/ui/skeleton";
export const TotalStake = () => {
  const { data: validators, isSuccess: isValidatorsSuccessful } =
    useValidators();

  if (!isValidatorsSuccessful || !validators)
    return (
      <MyValidatorsCardLoading
        title="Total ETH Staked"
        body={
          <div className="flex flex-row items-center gap-x-2">
            <span>Ξ</span>
            <Skeleton className="h-8 w-16 bg-slate-50" />
          </div>
        }
        subtext={
          <div className="flex flex-row items-center gap-x-2">
            <span>Average</span>
            <Skeleton className="mt-1 h-3 w-12 bg-slate-50" />
            <span>per validator</span>
          </div>
        }
      />
    );

  const totalStake = validators.reduce(
    (acc, validator) => acc + validator.balance,
    0,
  );
  const averageStake =
    validators.length > 0 ? totalStake / validators.length : 0n;

  return (
    <MyValidatorsCard
      title="Total ETH Staked"
      body={<p>Ξ {displayedEthAmount(totalStake)}</p>}
      subtext={`Average ${displayedEthAmount(averageStake)} per validator`}
    />
  );
};
