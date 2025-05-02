"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { sumBy } from "lodash";
import {
  type DepositTableValidatorDetails,
  SUBMITTING_DEPOSIT_COLUMN_HEADERS,
} from "pec/constants/columnHeaders";
import { MAX_VALIDATOR_BALANCE } from "pec/constants/deposit";
import { useBatchDeposit } from "pec/hooks/useBatchDeposit";
import {
  type FormDepositData,
  FormDepositSchema,
  type FormDepositType,
} from "pec/lib/api/schemas/deposit";
import { DECIMAL_PLACES } from "pec/lib/constants";
import { EDistributionMethod } from "pec/types/batch-deposits";
import type { ValidatorDetails } from "pec/types/validator";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Email } from "../consolidation/summary/Email";
import { DisplayAmount } from "../ui/table/TableComponents";
import { ValidatorTable } from "../ui/table/ValidatorTable";
import { DepositSignDataCard } from "../validators/cards/DepositSignDataCard";
import { DistributionInformation } from "./distribution/DistributionInformation";
import { DistributionMethod } from "./distribution/DistributionMethod";
import { SignatureDetails } from "./SignatureDetails";
import { SelectValidators } from "./validators/SelectValidators";
import { StageAnimationStep, StageAnimationParent } from "../stage-animation";

export interface IDepositWorkflowProps {
  validators: ValidatorDetails[];
  balance: number;
}

export const DepositWorkflow = ({
  validators,
  balance,
}: IDepositWorkflowProps) => {
  const { submitBatchDeposit, stage, resetStage } = useBatchDeposit();
  const [showEmail, setShowEmail] = useState(false);

  const totalValidatorBalance = sumBy(validators, "balance");

  const maxTotalRemaining =
    validators.length * MAX_VALIDATOR_BALANCE - totalValidatorBalance;

  const initialValues: FormDepositType = {
    deposits: [],
    totalToDistribute: 0,
    distributionMethod: EDistributionMethod.SPLIT,
    email: "",
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isValid, errors },
  } = useForm<FormDepositType>({
    resolver: zodResolver(FormDepositSchema(balance, maxTotalRemaining)),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const [
    watchedDeposits,
    watchedDistributionMethod,
    watchTotalToDistribute,
    watchEmail,
  ] = useWatch({
    control,
    name: ["deposits", "distributionMethod", "totalToDistribute", "email"],
  });

  const email = watchEmail ?? "";
  // Stupid RHF doesn't handle an empty input and returns a string, even when you specify its a number
  const totalToDistribute =
    watchedDistributionMethod === EDistributionMethod.MANUAL
      ? watchedDeposits.reduce((acc, curr) => acc + (curr.amount ?? 0), 0)
      : isNaN(watchTotalToDistribute)
        ? 0
        : watchTotalToDistribute;

  const totalAllocated = Number(
    watchedDeposits
      .reduce((acc, curr) => acc + (curr.amount ?? 0), 0)
      .toFixed(DECIMAL_PLACES),
  );

  const depositExceedsRemaining = watchedDeposits.some((deposit) => {
    const remainingBalance = MAX_VALIDATOR_BALANCE - deposit.validator.balance;
    return remainingBalance < deposit.amount;
  });

  const hasInvalidAmount =
    watchedDeposits.some((deposit) => {
      return deposit.amount === 0;
    }) || depositExceedsRemaining;

  const submitButtonDisabled =
    !isValid ||
    totalAllocated !== totalToDistribute ||
    totalToDistribute <= 0 ||
    totalAllocated > balance ||
    (showEmail && email.length === 0) ||
    hasInvalidAmount;

  const handleDistributionMethodChange = (method: EDistributionMethod) => {
    reset({
      ...initialValues,
      distributionMethod: method,
    });

    if (method === EDistributionMethod.SPLIT) {
      updateDepositsArrayWithSplitAmount(watchedDeposits, totalToDistribute);
    }
  };

  const handleClearValidators = () => {
    setValue("deposits", []);
  };

  const updateDepositsArrayWithSplitAmount = (
    deposits: FormDepositData[],
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

    if (watchedDistributionMethod === EDistributionMethod.SPLIT)
      updateDepositsArrayWithSplitAmount(updatedDeposits, totalToDistribute);
    else setValue("deposits", updatedDeposits);
  };

  const handleResetBatchDeposit = () => {
    reset(initialValues);
    resetStage();
  };

  const onSubmit = async (data: FormDepositType) => {
    const filteredData = data.deposits.filter((deposit) => deposit.amount > 0);
    await submitBatchDeposit(filteredData, totalAllocated, data.email);
  };

  return (
    <div className="flex w-full flex-col gap-y-4">
      <div className="space-y-8">
        <StageAnimationParent
          stage={stage.type}
          stageOrder={["data-capture", "sign-submit"]}
          stepClassName="flex flex-col gap-y-4"
        >
          {stage.type === "data-capture" && (
            <StageAnimationStep key="data-capture">
              {balance === 0 ? (
                <SignatureDetails
                  title="Insufficient balance"
                  text="Please top up your wallet with ETH before submitting deposits."
                />
              ) : (
                <>
                  <DistributionMethod
                    submitButtonDisabled={submitButtonDisabled}
                    errors={errors}
                    register={register}
                    distributionMethod={watchedDistributionMethod}
                    onDistributionMethodChange={handleDistributionMethodChange}
                    onSubmit={handleSubmit(onSubmit)}
                    resetBatchDeposit={handleResetBatchDeposit}
                    numDeposits={watchedDeposits.length}
                    stage={stage}
                    totalAllocated={totalAllocated}
                    totalToDistribute={totalToDistribute}
                    walletBalance={balance}
                  />

                  <Email
                    showEmail={showEmail}
                    setShowEmail={setShowEmail}
                    cardText="Add your email to receive an email when your deposits are complete."
                    cardTitle="Notify me when complete"
                    summaryEmail={email}
                    errors={errors}
                    setSummaryEmail={(email) =>
                      setValue("email", email, {
                        shouldValidate: true,
                      })
                    }
                  />

                  {(watchedDistributionMethod === EDistributionMethod.MANUAL ||
                    (watchedDistributionMethod === EDistributionMethod.SPLIT &&
                      totalToDistribute > 0)) && (
                    <SelectValidators
                      errors={errors}
                      register={register}
                      clearSelectedValidators={handleClearValidators}
                      distributionMethod={watchedDistributionMethod}
                      handleValidatorSelect={handleValidatorSelect}
                      totalToDistribute={totalToDistribute}
                      deposits={watchedDeposits}
                      validators={validators}
                      depositExceedsRemaining={depositExceedsRemaining}
                    />
                  )}
                </>
              )}
            </StageAnimationStep>
          )}

          {stage.type === "sign-submit" && (
            <StageAnimationStep key="sign-submit">
              <DistributionInformation
                resetBatchDeposit={reset}
                stage={stage}
                totalAllocated={totalAllocated}
                totalToDistribute={totalToDistribute}
                numDeposits={watchedDeposits.length}
              />
              <div className="text-md font-670">Deposits</div>
              <ValidatorTable
                headers={SUBMITTING_DEPOSIT_COLUMN_HEADERS}
                data={watchedDeposits.map(
                  (w): DepositTableValidatorDetails => ({
                    ...w.validator,
                    depositAmount: w.amount,
                  }),
                )}
                wrapperProps={{ clearBackground: true }}
                disableSort
                disablePagination
                renderOverrides={{
                  depositAmount: (value) => (
                    <DisplayAmount
                      amount={value.depositAmount}
                      opts={{ decimals: 4 }}
                    />
                  ),
                  transactionStatus: () => (
                    <DepositSignDataCard
                      transactionStatus={stage.transactionStatus}
                    />
                  ),
                }}
              />
            </StageAnimationStep>
          )}
        </StageAnimationParent>
      </div>
    </div>
  );
};
