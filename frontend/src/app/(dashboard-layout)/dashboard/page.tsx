"use client";

import type { FC } from "react";
import { api } from "pec/trpc/react";
import { BatchDeposit } from "pec/components/dashboard/tools/BatchDeposit";
import { Withdrawal } from "pec/components/dashboard/tools/Withdrawal";
import { Consolidate } from "pec/components/dashboard/tools/Consolidate";
import { ActiveValidators } from "pec/components/dashboard/validators/ActiveValidators";
import { TotalStake } from "pec/components/dashboard/validators/TotalStake";
import { TotalDailyIncome } from "pec/components/dashboard/validators/TotalDailyIncome";
import { ValidatorTable } from "pec/components/dashboard/validatorTable/ValidatorTable";
import { useWalletAddress } from "pec/hooks/useWallet";
import DashboardLoading from "./loading";
import { ValidatorStatus } from "pec/types/validator";

const Dashboard: FC = () => {
  const walletAddress = useWalletAddress();

  const { data, isFetched } = api.validators.getValidators.useQuery(
    {
      address: walletAddress || "",
    },
    { enabled: !!walletAddress },
  );

  if (!walletAddress || !data || !isFetched) return <DashboardLoading />;

  const activeValidators = data.filter(
    (validator) => validator.status === ValidatorStatus.ACTIVE,
  );

  const inactiveValidators = data.filter(
    (validator) => validator.status === ValidatorStatus.INACTIVE,
  );

  return (
    <div className="flex w-full flex-col items-center space-y-10 dark:text-white ">
      <div className="flex w-full items-center justify-center bg-indigo-50 dark:bg-gray-900 p-12">
      <div className="w-[80vw] space-y-6 ">
        <div className="text-2xl font-medium text-indigo-800 dark:text-indigo-200">
          Tools
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Consolidate />
          <BatchDeposit />
          <Withdrawal />
        </div>
      </div>
      </div>

      <div className="flex w-full items-center justify-center">
        <div className="w-[80vw] space-y-4">
          <div className="text-2xl font-medium text-indigo-800 dark:text-indigo-200">My Validators</div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <ActiveValidators
              activeValidators={activeValidators.length}
              inactiveValidators={inactiveValidators.length}
            />
            <TotalStake validators={data} />
            <TotalDailyIncome />
          </div>

          <div className="pt-8">
            <ValidatorTable validators={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
