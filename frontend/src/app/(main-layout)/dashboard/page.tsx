"use client";

import type { FC } from "react";
import { api } from "pec/trpc/react";
import { BatchDeposit } from "pec/components/dashboard/tools/BatchDeposit";
import { BatchWithdrawal } from "pec/components/dashboard/tools/BatchWithdrawal";
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
    <div className="space-y-6 dark:text-white">
      <div className="text-2xl font-medium">Tools</div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Consolidate />
        <BatchDeposit />
        <BatchWithdrawal />
      </div>

      <div className="text-2xl font-medium">My Validators</div>

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
  );
};

export default Dashboard;
