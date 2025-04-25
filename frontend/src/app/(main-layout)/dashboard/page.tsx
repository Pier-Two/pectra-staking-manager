"use client";

import { ToolCard } from "pec/components/dashboard/tools/ToolCard";
import { ActiveValidators } from "pec/components/dashboard/validators/ActiveValidators";
import { TotalDailyIncome } from "pec/components/dashboard/validators/TotalDailyIncome";
import { TotalStake } from "pec/components/dashboard/validators/TotalStake";
import { DashboardValidatorTable } from "pec/components/dashboard/validatorTable/ValidatorTable";
import { useWalletAddress } from "pec/hooks/useWallet";
import type { FC } from "react";
import DashboardLoading from "./loading";
import { useValidators } from "pec/hooks/useValidators";
import { useValidatorPerformance } from "pec/hooks/useValidatorPerformance";
import { useEthPrice } from "pec/hooks/useEthPrice";
import { ValidatorStatus } from "pec/types/validator";

const Dashboard: FC = () => {
  const walletAddress = useWalletAddress();
  const {
    data: validators,
    isFetched: isValidatorsFetched,
    groupedValidators,
  } = useValidators();
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

  const activeValidators = groupedValidators[ValidatorStatus.ACTIVE] ?? [];

  const inactiveValidators = validators.length - activeValidators.length;

  return (
    <div className="flex w-full flex-col items-center dark:text-white">
      <div className="flex w-full items-center justify-center bg-indigo-50 pb-12 dark:bg-gray-900">
        <div className="space-y-6">
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

      <div className="relative flex h-full w-screen justify-center bg-white">
        <div className={"w-full max-w-[80rem]"}>
          <div className="w-full space-y-8 px-2 py-8 md:px-8 xl:px-0">
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
              <DashboardValidatorTable validators={validators} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
