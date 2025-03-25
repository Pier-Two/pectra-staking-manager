"use client";

import { type FC, useState, useEffect } from "react";
import { ArrowDownToDot } from "lucide-react";
import { SignatureDetails } from "pec/components/batch-deposits/SignatureDetails";
import { MOCK_VALIDATORS } from "pec/server/__mocks__/validators";
import {
  type IBatchDepositValidators,
  type IBatchDepositState,
  EDistributionMethod,
  EBatchDepositStage,
} from "pec/types/batch-deposits";
import { DistributionMethod } from "pec/components/batch-deposits/distribution/DistributionMethod";
import { SelectValidators } from "pec/components/batch-deposits/validators/SelectValidators";
import { DepositList } from "pec/components/batch-deposits/validators/DepositList";

const BatchDeposit: FC = () => {
  const data = MOCK_VALIDATORS;
  const balance = 100;

  const [stage, setStage] = useState<EBatchDepositStage>(
    EBatchDepositStage.SIGN_DATA,
  );

  const [state, setState] = useState<IBatchDepositState>({
    distributionMethod: EDistributionMethod.SPLIT,
    selectedValidators: data.map((v) => ({
      validator: v,
      depositAmount: 0,
    })),
    totalToDistribute: 0,
    totalAllocated: 0,
    disableButton: true,
  });

  useEffect(() => {
    const shouldBeDisabled =
      state.totalAllocated !== state.totalToDistribute ||
      state.totalToDistribute === 0 ||
      state.totalAllocated === 0;

    setState((prev) => ({ ...prev, disableButton: shouldBeDisabled }));
  }, [state.totalAllocated, state.totalToDistribute]);

  const evenlySplitValidators = (
    validators: IBatchDepositValidators[],
  ): IBatchDepositValidators[] => {
    if (validators.length === 0) return [];
    const depositAmount = state.totalToDistribute / validators.length;
    return validators.map((v) => ({ ...v, depositAmount }));
  };

  const handleDistributionMethodChange = (method: EDistributionMethod) => {
    setState((prev) => ({
      ...prev,
      distributionMethod: method,
      selectedValidators: [],
      totalAllocated: 0,
      totalToDistribute: 0,
    }));
  };

  const handleTotalAmountChange = (amount: number) => {
    setState((prev) => ({ ...prev, totalToDistribute: amount }));
  };

  const handleClearValidators = () => {
    setState((prev) => ({
      ...prev,
      selectedValidators: [],
      totalAllocated: 0,
    }));
  };

  const handleSelectValidator = (validator: IBatchDepositValidators) => {
    setState((prev) => {
      const isRemoving = prev.selectedValidators.some(
        (v) =>
          v.validator.validatorIndex === validator.validator.validatorIndex,
      );

      const newValidators = isRemoving
        ? prev.selectedValidators.filter(
            (v) =>
              v.validator.validatorIndex !== validator.validator.validatorIndex,
          )
        : [...prev.selectedValidators, validator];

      const finalValidators =
        prev.distributionMethod === EDistributionMethod.SPLIT
          ? evenlySplitValidators(newValidators)
          : newValidators;

      return {
        ...prev,
        selectedValidators: finalValidators,
        totalAllocated: finalValidators.reduce(
          (acc, v) => acc + v.depositAmount,
          0,
        ),
      };
    });
  };

  const handleDepositAmountChange = (validator: IBatchDepositValidators) => {
    setState((prev) => {
      const newValidators = prev.selectedValidators.map((v) =>
        v.validator.validatorIndex === validator.validator.validatorIndex
          ? validator
          : v,
      );

      return {
        ...prev,
        selectedValidators: newValidators,
        totalAllocated: newValidators.reduce(
          (acc, v) => acc + v.depositAmount,
          0,
        ),
      };
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex gap-x-4 text-indigo-800 dark:text-indigo-300">
          <ArrowDownToDot className="h-10 w-10" />
          <div className="text-3xl">Batch Deposit</div>
        </div>

        <div className="w-[45vw] text-gray-700 dark:text-gray-300">
          Top up your existing validators in one transaction.
        </div>
      </div>

      {stage === EBatchDepositStage.DATA_CAPTURE && (
        <>
          <SignatureDetails
            title="Validators signatures required to submit deposits"
            text="To submit deposits, you'll need to generate and provide signatures with your validator key pairs (not withdrawal address). You will be prompted to create these signatures once deposit data is generated."
          />

          <DistributionMethod
            disableButton={state.disableButton}
            distributionMethod={state.distributionMethod}
            onDistributionMethodChange={handleDistributionMethodChange}
            onTotalAmountChange={handleTotalAmountChange}
            selectedValidators={state.selectedValidators}
            setStage={setStage}
            totalAllocated={state.totalAllocated}
            totalToDistribute={state.totalToDistribute}
            walletBalance={balance}
          />

          {state.totalToDistribute !== 0 && (
            <SelectValidators
              clearSelectedValidators={handleClearValidators}
              distributionMethod={state.distributionMethod}
              handleDepositAmountChange={handleDepositAmountChange}
              selectedValidators={state.selectedValidators}
              setSelectedValidators={handleSelectValidator}
              totalAllocated={state.totalAllocated}
              totalToDistribute={state.totalToDistribute}
              validators={data}
            />
          )}
        </>
      )}

      {stage === EBatchDepositStage.SIGN_DATA && (
        <>
          <SignatureDetails
            title="Sign deposit data"
            text="For each deposit, copy the generated deposit data, sign it with your validator key and add the signed data. Once provided, the system will verify the deposit data before requesting ETH."
          />

          <DepositList deposits={state.selectedValidators} />
        </>
      )}
    </div>
  );
};

export default BatchDeposit;
