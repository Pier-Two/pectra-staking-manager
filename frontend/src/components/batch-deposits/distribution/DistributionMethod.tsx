import type {
  DepositWorkflowStage,
  EDistributionMethod,
} from "pec/types/batch-deposits";
import { DistributionInformation } from "./DistributionInformation";
import { DistributionOption } from "./DistributionOption";
import { TotalAmountInput } from "./TotalAmountInput";
import type { DepositType } from "pec/lib/api/schemas/deposit";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { DISTRIBUTION_OPTIONS } from "pec/constants/deposit";

export interface IDistributionMethodProps {
  disableButton: boolean;
  distributionMethod: EDistributionMethod;
  onDistributionMethodChange: (method: EDistributionMethod) => void;
  onSubmit: () => void;
  resetBatchDeposit: () => void;
  numDeposits: number;
  stage: DepositWorkflowStage;
  totalAllocated: number;
  totalToDistribute: number;
  walletBalance: number;
  errors: FieldErrors<DepositType>;
  register: UseFormRegister<DepositType>;
}

export const DistributionMethod = ({
  disableButton,
  distributionMethod,
  onDistributionMethodChange,
  onSubmit,
  resetBatchDeposit,
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
      <div className="space-y-4">
        <div className="text-md font-medium">Distribution Method</div>
        <div className="flex flex-row justify-between gap-8">
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

      <TotalAmountInput
        amount={totalToDistribute}
        errors={errors}
        register={register}
        walletBalance={walletBalance}
      />

      <div className="space-y-2">
        <DistributionInformation
          buttonText="Deposit"
          disableButton={disableButton}
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
