import type { FC } from "react";
import { BatchDeposit } from "pec/components/dashboard/tools/BatchDeposit";
import { BatchWithdrawal } from "pec/components/dashboard/tools/BatchWithdrawal";
import { Consolidate } from "pec/components/dashboard/tools/Consolidate";
import { ActiveValidators } from "pec/components/dashboard/validators/ActiveValidators";
import { TotalStake } from "pec/components/dashboard/validators/TotalStake";
import { TotalDailyIncome } from "pec/components/dashboard/validators/TotalDailyIncome";

const Dashboard: FC = () => {
  return (
    <div className="dark:text-white space-y-6">
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
    </div>
  );
};
export default Dashboard;
