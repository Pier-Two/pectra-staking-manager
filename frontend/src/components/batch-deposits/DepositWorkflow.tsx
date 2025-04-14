"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDownToDot } from "lucide-react";
import { useContracts } from "pec/hooks/useContracts";
import { DepositSchema, type DepositType } from "pec/lib/api/schemas/deposit";
import type { IDepositWorkflowProps } from "pec/types/batch-deposits";
import {
  EBatchDepositStage,
  EDistributionMethod,
  type IBatchDepositValidators,
} from "pec/types/batch-deposits";
import type { ValidatorDetails } from "pec/types/validator";
import type { FC } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { DistributionMethod } from "./distribution/DistributionMethod";
import { SignatureDetails } from "./SignatureDetails";
import { DepositList } from "./validators/DepositList";
import { SelectValidators } from "./validators/SelectValidators";

export const DepositWorkflow: FC<IDepositWorkflowProps> = ({
  data,
  balance,
}) => {
  const initialValues: DepositType = {
    selectedValidators: [],
    stage: EBatchDepositStage.DATA_CAPTURE,
    deposits: data
      ? data?.map((validator) => ({
          validator,
          amount: 0n,
        }))
      : [],
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
    resolver: zodResolver(DepositSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const { fields: deposits } = useFieldArray({
    control,
    name: "deposits",
  });

  const { append, remove } = useFieldArray({
    control,
    name: "selectedValidators",
  });

  const watchedDeposits = useWatch({
    control,
    name: "deposits",
  });

  const watchedSelectedValidators = useWatch({
    control,
    name: "selectedValidators",
  });

  const stage = useWatch({
    control,
    name: "stage",
  });

  const watchedDistributionMethod = useWatch({
    control,
    name: "distributionMethod",
  });

  const totalToDistribute = useWatch({
    control,
    name: "totalToDistribute",
  });

  const totalAllocated = watchedDeposits.reduce(
    (acc, curr) => acc + (curr.amount ?? 0n),
    0n,
  );

  const shouldBeDisabled =
    totalAllocated !== BigInt(totalToDistribute) ||
    totalAllocated > totalToDistribute ||
    totalToDistribute === 0 ||
    totalAllocated === 0n;

  const handleDistributionMethodChange = (method: EDistributionMethod) => {
    setValue("distributionMethod", method);
    handleClearValidators();
    setValue("stage", EBatchDepositStage.DATA_CAPTURE);
  };

  const handleClearValidators = () => {
    setValue("selectedValidators", []);
    setValue("totalToDistribute", 0);
    setValue(
      "deposits",
      data
        ? data.map((validator) => ({
            validator,
            amount: BigInt(0),
          }))
        : [],
    );
  };

  const updateDepositsForSplitDistribution = (
    selectedValidator: ValidatorDetails,
    isAdding: boolean,
  ) => {
    const validatorCount = isAdding
      ? watchedSelectedValidators.length + 1
      : watchedSelectedValidators.length - 1;
    const splitAmount = totalToDistribute / validatorCount;

    return watchedDeposits.map((deposit) => {
      const isCurrentValidator =
        deposit.validator.validatorIndex === selectedValidator.validatorIndex;

      if (!isAdding && isCurrentValidator) return { ...deposit, amount: 0n };

      const isSelected = watchedSelectedValidators.some(
        (v) => v.validatorIndex === deposit.validator.validatorIndex,
      );

      return {
        ...deposit,
        amount:
          isSelected || (isAdding && isCurrentValidator)
            ? BigInt(splitAmount)
            : 0n,
      };
    });
  };

  const updateDepositsForManualDistribution = (
    selectedValidator: ValidatorDetails,
  ) => {
    return watchedDeposits.map((deposit) => ({
      ...deposit,
      amount:
        deposit.validator.validatorIndex === selectedValidator.validatorIndex
          ? 0n
          : deposit.amount,
    }));
  };

  const handleValidatorSelect = (validator: ValidatorDetails) => {
    const existingIndex = watchedSelectedValidators.findIndex(
      (selectedValidator) =>
        selectedValidator.validatorIndex === validator.validatorIndex,
    );

    const isAdding = existingIndex === -1;

    if (isAdding) append(validator);
    else remove(existingIndex);

    const newDeposits =
      watchedDistributionMethod === EDistributionMethod.SPLIT
        ? updateDepositsForSplitDistribution(validator, isAdding)
        : updateDepositsForManualDistribution(validator);

    setValue("deposits", newDeposits);
  };

  const handleResetBatchDeposit = () => {
    reset(initialValues);
  };

  const onSubmit = (data: DepositType, realSubmit = false) => {
    // TODO Max
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

        {stage === EBatchDepositStage.DATA_CAPTURE && (
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
                  disableButton={shouldBeDisabled || !isValid}
                  distributionMethod={watchedDistributionMethod}
                  onDistributionMethodChange={handleDistributionMethodChange}
                  onSubmit={handleSubmit((data) => onSubmit(data, true))}
                  resetBatchDeposit={handleResetBatchDeposit}
                  selectedValidators={
                    watchedSelectedValidators as ValidatorDetails[]
                  }
                  stage={stage}
                  setValue={setValue}
                  totalAllocated={totalAllocated}
                  totalToDistribute={
                    isNaN(totalToDistribute) ? 0 : totalToDistribute
                  }
                  walletBalance={balance}
                />

                {totalToDistribute > 0 && (
                  <SelectValidators
                    errors={errors}
                    register={register}
                    clearSelectedValidators={handleClearValidators}
                    distributionMethod={watchedDistributionMethod}
                    handleValidatorSelect={handleValidatorSelect}
                    selectedValidators={
                      watchedSelectedValidators as ValidatorDetails[]
                    }
                    totalAllocated={totalAllocated}
                    totalToDistribute={totalToDistribute}
                    watchedDeposits={
                      watchedDeposits as IBatchDepositValidators[]
                    }
                    validators={data}
                  />
                )}
              </>
            )}
          </>
        )}

        {stage !== EBatchDepositStage.DATA_CAPTURE && (
          <>
            <SignatureDetails
              title="Sign deposit data"
              text="For each deposit, copy the generated deposit data, sign it with your validator key and add the signed data. Once provided, the system will verify the deposit data before requesting ETH."
            />

            <DepositList
              deposits={watchedDeposits as IBatchDepositValidators[]}
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
