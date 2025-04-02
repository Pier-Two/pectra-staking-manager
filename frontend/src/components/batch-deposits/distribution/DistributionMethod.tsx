"use client";

import { type FC, useState } from "react";
import {
  EBatchDepositStage,
  EDistributionMethod,
  type IDistributionMethodProps,
  type IDistributionOption,
} from "pec/types/batch-deposits";
import { DistributionInformation } from "./DistributionInformation";
import { DistributionOption } from "./DistributionOption";
import { TotalAmountInput } from "./TotalAmountInput";
import type { DepositType } from "pec/lib/api/schemas/deposit";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

const DISTRIBUTION_OPTIONS: IDistributionOption[] = [
  {
    method: EDistributionMethod.SPLIT,
    title: "Split evenly",
    description:
      "Enter a single total amount and have it deposited evenly across selected validators",
  },
  {
    method: EDistributionMethod.MANUAL,
    title: "Manual entry",
    description:
      "Enter individual deposit amount for each selected validator and submit one transaction for total.",
  },
];

interface ExtendedProps extends IDistributionMethodProps {
  errors: FieldErrors<DepositType>;
  register: UseFormRegister<DepositType>;
}

export const DistributionMethod: FC<ExtendedProps> = (props) => {
  const {
    disableButton,
    distributionMethod,
    onDistributionMethodChange,
    onSubmit,
    resetBatchDeposit,
    selectedValidators,
    stage,
    setValue,
    totalAllocated,
    totalToDistribute,
    walletBalance,
    errors,
    register,
  } = props;

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
          selectedValidators={selectedValidators}
          stage={stage}
          setValue={setValue}
          totalAllocated={totalAllocated}
          totalToDistribute={totalToDistribute}
        />
      </div>
    </div>
  );
};
