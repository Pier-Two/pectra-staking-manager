import { ToolCard } from "pec/components/dashboard/tools/ToolCard";
import { ActiveValidators } from "pec/components/dashboard/validators/ActiveValidators";
import { TotalStake } from "pec/components/dashboard/validators/TotalStake";
import { TotalDailyIncome } from "pec/components/dashboard/validators/TotalDailyIncome";
import { DashboardValidatorTable } from "pec/components/dashboard/validatorTable/ValidatorTable";
import type { Metadata } from "next";
import { title } from "pec/constants/metadata";
import { RedirectWhenDisconnected } from "pec/hooks/use-redirect-when-disconnected";
import { TriangleAlert } from "lucide-react";

export const metadata: Metadata = {
  title: title("Dashboard"),
};

const Dashboard = () => (
  <>
    <RedirectWhenDisconnected />
    <div className="flex w-full flex-col items-center">
      <div className="relative -mt-8 flex h-20 w-screen items-center bg-orange-100 dark:bg-orange-900">
        <div className="flex max-w-[80rem] flex-col gap-1 px-2 py-8 md:px-8 xl:px-2">
          <div className="flex gap-2">
            <TriangleAlert fill="orange" />
            <div className="text-base">
              Notice: Validator Data May Be Inaccurate
            </div>
          </div>
          <div className="text-sm">
            Due to the ongoing Ethereum Pectra upgrade and updates being applied
            to third-party services like beaconcha.in, some validator
            information may not display correctly or be temporarily out of sync.
          </div>
        </div>
      </div>
      <div className="relative flex max-w-[80rem] items-center justify-center pb-12 pt-4">
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
      <div className="relative flex h-full w-screen justify-center bg-white dark:bg-gray-900">
        <div className={"w-full max-w-[80rem]"}>
          <div className="w-full space-y-8 px-2 py-8 md:px-8 xl:px-2">
            <h2 className="text-[26px] font-570 leading-[26px] text-primary-dark dark:text-indigo-200">
              My Validators
            </h2>

            <div className="grid grid-cols-1 gap-8 text-sm md:grid-cols-2 lg:grid-cols-3">
              <ActiveValidators />

              <TotalStake />

              <TotalDailyIncome />
            </div>

            <div className="pt-8">
              <DashboardValidatorTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default Dashboard;
