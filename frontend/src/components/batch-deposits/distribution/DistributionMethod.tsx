import { DISTRIBUTION_OPTIONS } from "pec/constants/deposit";
import type { DepositType } from "pec/lib/api/schemas/deposit";
import type { DepositWorkflowStage } from "pec/types/batch-deposits";
import { EDistributionMethod } from "pec/types/batch-deposits";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { DistributionInformation } from "./DistributionInformation";
import { DistributionOption } from "./DistributionOption";
import { TotalAmountInput } from "./TotalAmountInput";

export interface IDistributionMethodProps {
  distributionMethod: EDistributionMethod;
  onDistributionMethodChange: (method: EDistributionMethod) => void;
  onSubmit: () => void;
  resetBatchDeposit: () => void;
  numDeposits: number;
  submitButtonDisabled: boolean;
  stage: DepositWorkflowStage;
  totalAllocated: number;
  totalToDistribute: number;
  walletBalance: number;
  errors: FieldErrors<DepositType>;
  register: UseFormRegister<DepositType>;
}

export const DistributionMethod = ({
  distributionMethod,
  onDistributionMethodChange,
  onSubmit,
  resetBatchDeposit,
  submitButtonDisabled,
  numDeposits,
  stage,
  totalAllocated,
  totalToDistribute,
  walletBalance,
  errors,
  register,
}: IDistributionMethodProps) => {
  const handleDistributionMethodChange = (method: EDistributionMethod) => {
    onDistributionMethodChange(method);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="text-sm font-670">Distribution Method</div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
          {DISTRIBUTION_OPTIONS.map((option) => (
            <DistributionOption
              key={option.method}
              option={option}
              isSelected={distributionMethod === option.method}
              onClick={() => handleDistributionMethodChange(option.method)}
            />
          ))}
        </div>
      </div>

      {distributionMethod === EDistributionMethod.SPLIT && (
        <TotalAmountInput
          errors={errors}
          register={register}
          walletBalance={walletBalance}
        />
      )}

      <div className="flex w-full justify-center space-y-2">
        <DistributionInformation
          submitButtonDisabled={submitButtonDisabled}
          onSubmit={onSubmit}
          resetBatchDeposit={resetBatchDeposit}
          numDeposits={numDeposits}
          stage={stage}
          totalAllocated={totalAllocated}
          totalToDistribute={totalToDistribute}
        />
      </div>
    </div>
  );
};
