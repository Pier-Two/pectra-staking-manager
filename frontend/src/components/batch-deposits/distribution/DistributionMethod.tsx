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

export const DistributionMethod: FC<IDistributionMethodProps> = (props) => {
  const {
    disableButton,
    distributionMethod,
    onDistributionMethodChange,
    onTotalAmountChange,
    resetBatchDeposit,
    selectedValidators,
    stage,
    setStage,
    totalAllocated,
    totalToDistribute,
    walletBalance,
  } = props;

  const [amount, setAmount] = useState<number>(0);

  const handleDistributionMethodChange = (method: EDistributionMethod) => {
    onDistributionMethodChange(method);
    setAmount(0);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const newAmount =
      isNaN(value) || value < 0 || value > walletBalance ? 0 : value;

    setAmount(newAmount);
    onTotalAmountChange(newAmount);
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
        amount={amount}
        walletBalance={walletBalance}
        onChange={handleAmountChange}
      />

      <div className="space-y-2">
        <DistributionInformation
          buttonText="Next"
          disableButton={disableButton}
          onClick={() => setStage(EBatchDepositStage.SIGN_DATA)}
          resetBatchDeposit={resetBatchDeposit}
          selectedValidators={selectedValidators}
          stage={stage}
          setStage={setStage}
          totalAllocated={totalAllocated}
          totalToDistribute={totalToDistribute}
        />
      </div>
    </div>
  );
};
