"use client";

import { ToolCard } from "pec/components/dashboard/tools/ToolCard";
import { ActiveValidators } from "pec/components/dashboard/validators/ActiveValidators";
import { TotalDailyIncome } from "pec/components/dashboard/validators/TotalDailyIncome";
import { TotalStake } from "pec/components/dashboard/validators/TotalStake";
import { ValidatorTable } from "pec/components/dashboard/validatorTable/ValidatorTable";
import { useWalletAddress } from "pec/hooks/useWallet";
import { ValidatorStatus } from "pec/types/validator";
import type { FC } from "react";
import DashboardLoading from "./loading";
import { useValidators } from "pec/hooks/useValidators";
import { useValidatorPerformance } from "pec/hooks/useValidatorPerformance";
import { useEthPrice } from "pec/hooks/useEthPrice";

const Dashboard: FC = () => {
  const walletAddress = useWalletAddress();
  const { data: validators, isFetched: isValidatorsFetched } = useValidators();
  const { data: ethPrice, isFetched: isEthPriceFetched } = useEthPrice(
    "ETH",
    "USD",
  );
  const { data: validatorPerformanceInWei, isFetched: isPerformanceFetched } =
    useValidatorPerformance("daily");

  if (
    !walletAddress ||
    !validators ||
    !isValidatorsFetched ||
    validatorPerformanceInWei === undefined ||
    !isPerformanceFetched ||
    ethPrice === undefined ||
    !isEthPriceFetched
  )
    return <DashboardLoading />;

  const activeValidators = validators?.filter(
    (validator) =>
      validator?.status === ValidatorStatus.ACTIVE ||
      validator?.consolidationTransaction?.isConsolidatedValidator !== false,
  );

  const inactiveValidators = validators.length - activeValidators.length;

  return (
    <div className="flex w-full flex-col items-center dark:text-white">
      <div className="flex w-full items-center justify-center bg-indigo-50 p-12 dark:bg-gray-900">
        <div className="w-[78vw] space-y-6">
          <div className="text-2xl font-medium text-indigo-800 dark:text-indigo-200">
            Tools
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <ToolCard preset="Consolidate" />
            <ToolCard preset="BatchDeposit" />
            <ToolCard preset="Withdrawal" />
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center pt-12">
        {/*
          // TODO: Refactor to note use vw
        */}
        <div className="w-[75vw] space-y-6">
          <h2 className="text-[26px] font-570 leading-[26px] text-primary-dark dark:text-indigo-200">
            My Validators
          </h2>

          <div className="grid grid-cols-1 gap-8 text-sm md:grid-cols-2 lg:grid-cols-3">
            <ActiveValidators
              activeValidators={activeValidators.length}
              inactiveValidators={inactiveValidators}
            />

            <TotalStake validators={validators} />

            <TotalDailyIncome
              validatorPerformanceInWei={validatorPerformanceInWei}
              ethPrice={ethPrice}
            />
          </div>

          <div className="pt-8">
            <ValidatorTable validators={validators} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
