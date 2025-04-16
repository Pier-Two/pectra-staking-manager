"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDownToDot } from "lucide-react";
import {
  DepositData,
  DepositSchema,
  type DepositType,
} from "pec/lib/api/schemas/deposit";
import {
  DepositWorkflowStage,
  EDistributionMethod,
} from "pec/types/batch-deposits";
import type { ValidatorDetails } from "pec/types/validator";
import { useForm, useWatch } from "react-hook-form";
import { DistributionMethod } from "./distribution/DistributionMethod";
import { SignatureDetails } from "./SignatureDetails";
import { DepositList } from "./validators/DepositList";
import { SelectValidators } from "./validators/SelectValidators";
import { useEffect, useState } from "react";
import { DECIMAL_PLACES } from "pec/lib/constants";

export interface IDepositWorkflowProps {
  validators: ValidatorDetails[];
  balance: number;
}

export const DepositWorkflow = ({
  validators,
  balance,
}: IDepositWorkflowProps) => {
  const [stage, setStage] = useState<DepositWorkflowStage>("data-capture");

  const initialValues: DepositType = {
    deposits: [],
    totalToDistribute: 0,
    distributionMethod: EDistributionMethod.SPLIT,
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isValid, errors },
  } = useForm<DepositType>({
    resolver: zodResolver(DepositSchema(balance)),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const [watchedDeposits, watchedDistributionMethod, watchTotalToDistribute] =
    useWatch({
      control,
      name: ["deposits", "distributionMethod", "totalToDistribute"],
    });

  // Stupid RHF doesn't handle an empty input and returns a string, even when you specify its a number
  const totalToDistribute = isNaN(watchTotalToDistribute)
    ? 0
    : watchTotalToDistribute;

  const totalAllocated = Number(
    watchedDeposits
      .reduce((acc, curr) => acc + (curr.amount ?? 0), 0)
      .toFixed(DECIMAL_PLACES),
  );

  const shouldBeDisabled =
    !isValid ||
    totalAllocated !== totalToDistribute ||
    totalToDistribute === 0 ||
    totalAllocated > balance;

  const handleDistributionMethodChange = (method: EDistributionMethod) => {
    setValue("distributionMethod", method);
    setStage("data-capture");

    if (method === EDistributionMethod.SPLIT) {
      updateDepositsArrayWithSplitAmount(watchedDeposits, totalToDistribute);
    }
  };

  const handleClearValidators = () => {
    setValue("totalToDistribute", 0);
    setValue("deposits", []);
  };

  const updateDepositsArrayWithSplitAmount = (
    deposits: DepositData[],
    totalToDistribute: number,
  ) => {
    const splitAmount = totalToDistribute / deposits.length;

    const updatedDeposits = deposits.map((deposit) => ({
      ...deposit,
      amount: splitAmount,
    }));

    setValue("deposits", updatedDeposits);
  };

  useEffect(() => {
    if (watchedDistributionMethod !== EDistributionMethod.SPLIT) return;

    updateDepositsArrayWithSplitAmount(watchedDeposits, totalToDistribute);
  }, [watchTotalToDistribute]);

  const handleValidatorSelect = (validator: ValidatorDetails) => {
    const existingIndex = watchedDeposits.findIndex(
      (selectedValidator) =>
        selectedValidator.validator.validatorIndex === validator.validatorIndex,
    );

    const updatedDeposits = [...watchedDeposits];

    if (existingIndex !== -1) {
      updatedDeposits.splice(existingIndex, 1);
    } else {
      updatedDeposits.push({
        validator,
        amount: 0,
      });
    }

    if (watchedDistributionMethod === EDistributionMethod.SPLIT) {
      updateDepositsArrayWithSplitAmount(updatedDeposits, totalToDistribute);
    } else {
      setValue("deposits", updatedDeposits);
    }
  };

  const handleResetBatchDeposit = () => {
    reset(initialValues);
  };

  const onSubmit = (data: DepositType, realSubmit = false) => {
    setStage("sign-data");

    if (realSubmit) {
      const filteredData = data.deposits.filter(
        (deposit) => deposit.amount > 0,
      );
      console.log("onSubmit for deposit HIT: ", filteredData);
    }
  };

  return (
    <form
      className="flex flex-col gap-y-4"
      onSubmit={handleSubmit((data) => onSubmit(data, false))}
    >
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex gap-x-4 text-indigo-800 dark:text-indigo-300">
            <ArrowDownToDot className="h-8 w-8" />
            <div className="text-2xl font-medium">Batch Deposit</div>
          </div>

          <div className="text-sm text-gray-700 dark:text-gray-300">
            Top up your existing validators in one transaction.
          </div>
        </div>

        {stage === "data-capture" && (
          <>
            {balance === 0 ? (
              <SignatureDetails
                title="Insufficient balance"
                text="Please top up your wallet with ETH before submitting deposits."
              />
            ) : (
              <>
                <SignatureDetails
                  title="Validators signatures required to submit deposits"
                  text="To submit deposits, you'll need to generate and provide signatures with your validator key pairs (not withdrawal address). You will be prompted to create these signatures once deposit data is generated."
                />

                <DistributionMethod
                  errors={errors}
                  register={register}
                  disableButton={shouldBeDisabled}
                  distributionMethod={watchedDistributionMethod}
                  onDistributionMethodChange={handleDistributionMethodChange}
                  onSubmit={handleSubmit((data) => onSubmit(data, true))}
                  resetBatchDeposit={handleResetBatchDeposit}
                  numDeposits={watchedDeposits.length}
                  stage={stage}
                  totalAllocated={totalAllocated}
                  totalToDistribute={totalToDistribute}
                  walletBalance={balance}
                />

                {totalToDistribute > 0 && (
                  <SelectValidators
                    errors={errors}
                    register={register}
                    clearSelectedValidators={handleClearValidators}
                    distributionMethod={watchedDistributionMethod}
                    handleValidatorSelect={handleValidatorSelect}
                    totalAllocated={totalAllocated}
                    totalToDistribute={totalToDistribute}
                    deposits={watchedDeposits}
                    validators={validators}
                  />
                )}
              </>
            )}
          </>
        )}

        {stage !== "data-capture" && (
          <>
            <SignatureDetails
              title="Sign deposit data"
              text="For each deposit, copy the generated deposit data, sign it with your validator key and add the signed data. Once provided, the system will verify the deposit data before requesting ETH."
            />

            <DepositList
              deposits={watchedDeposits}
              resetBatchDeposit={handleResetBatchDeposit}
              totalAllocated={totalAllocated}
              totalToDistribute={totalToDistribute}
            />
          </>
        )}
      </div>
    </form>
  );
};
