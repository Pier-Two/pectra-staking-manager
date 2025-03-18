"use client";

import { useEffect, useState, type FC } from "react";
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

const Dashboard: FC = () => {
  const walletAddress = useWalletAddress();
  const [isFetching, setIsFetching] = useState(true);

  const { data } = api.validators.getValidators.useQuery({
    address: walletAddress,
  });

  useEffect(() => {
    if (data) setIsFetching(false);
  }, [data]);

  if (!walletAddress || !data || isFetching) return <DashboardLoading />;

  return (
    <div className="space-y-6 dark:text-white">
      <div className="text-2xl">Tools</div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Consolidate />
        <BatchDeposit />
        <BatchWithdrawal />
      </div>

      <div className="text-2xl">My Validators</div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <ActiveValidators />
        <TotalStake />
        <TotalDailyIncome />
      </div>

      <div className="pt-8">
        <ValidatorTable validators={data} />
      </div>
    </div>
  );
};

export default Dashboard;
