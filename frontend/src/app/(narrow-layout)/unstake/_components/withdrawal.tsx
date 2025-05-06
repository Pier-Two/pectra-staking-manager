"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { sumBy } from "lodash";
import Image from "next/image";
import { ValidatorHeader } from "pec/components/batch-deposits/validators/ValidatorHeader";
import { Email } from "pec/components/consolidation/summary/Email";
import { DisplayAmount } from "pec/components/ui/table/TableComponents";
import { ValidatorTable } from "pec/components/ui/table/ValidatorTable";
import { WithdrawalInformation } from "pec/components/withdrawal/WithdrawalInformation";
import { WithdrawalValidatorTable } from "pec/components/withdrawal/WithdrawalValidatorTable";
import {
  SUBMITTING_WITHDRAWAL_COLUMN_HEADERS,
  type WithdrawalTableValidatorDetails,
} from "pec/constants/columnHeaders";
import { useValidators } from "pec/hooks/useValidators";
import { useWalletAddress } from "pec/hooks/useWallet";
import { useSubmitWithdraw } from "pec/hooks/useWithdraw";
import { formatAddressToShortenedString } from "pec/lib/utils/address";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import WithdrawalLoading from "./withdraw-loading";
import {
  FormWithdrawalSchema,
  type FormWithdrawalType,
} from "pec/lib/api/schemas/withdrawal";
import {
  StageAnimationParent,
  StageAnimationStep,
} from "pec/components/stage-animation";

const Withdrawal = () => {
  const walletAddress = useWalletAddress();
  const { activeType2Validators, isSuccess } = useValidators();

  const { submitWithdrawals, stage, setStage } = useSubmitWithdraw();

  const form = useForm<FormWithdrawalType>({
    resolver: zodResolver(FormWithdrawalSchema),
    defaultValues: { withdrawals: [], showEmail: false },
    mode: "onChange",
  });

  const {
    handleSubmit,
    setValue,
    reset,
    control,
    watch,
    register,
    formState: { errors },
  } = form;

  const { remove, append } = useFieldArray({
    control,
    name: "withdrawals",
  });

  const withdrawals = watch("withdrawals");
  const withdrawalTotal = sumBy(withdrawals, (withdrawal) => withdrawal.amount);

  const disabled = withdrawalTotal > 0;

  if (!isSuccess) return <WithdrawalLoading />;

  const handleMaxAllocation = (type: "partial" | "full") => {
    setValue(
      "withdrawals",
      activeType2Validators.map(
        (validator) => ({
          validator,
          amount:
            type === "partial" ? validator.balance - 32 : validator.balance,
        }),
        {
          // These options are critical to ensure proper updates
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        },
      ),
    );
  };

  const handleResetWithdrawal = () => {
    reset({ withdrawals: [] });
    setStage({ type: "data-capture" });
  };

  const onSubmit = async (data: FormWithdrawalType) => {
    await submitWithdrawals(data.withdrawals, data.email ?? "");
  };

  return (
    <FormProvider {...form}>
      <div className="flex flex-col gap-5 pt-8">
        <div className="flex flex-row gap-3 pl-4">
          <Image
            className="h-4 w-4"
            src="/icons/Wallet.svg"
            alt="Withdrawal Wallet"
            width={16}
            height={16}
          />

          <div className="text-sm font-570">Withdrawal address</div>
          <div className="text-sm text-piertwo-text">
            {formatAddressToShortenedString(walletAddress)}
          </div>
        </div>
        <WithdrawalInformation
          buttonText="Withdraw"
          handleMaxAllocation={handleMaxAllocation}
          disabled={disabled}
          onSubmit={handleSubmit(onSubmit)}
          resetWithdrawal={handleResetWithdrawal}
          stage={stage}
          validatorsSelected={withdrawals.length}
          withdrawalTotal={withdrawalTotal}
        />
      </div>

      <StageAnimationParent
        stage={stage.type}
        stageOrder={["data-capture", "sign-submit-finalise"]}
        stepClassName="flex flex-col gap-5"
      >
        {stage.type !== "sign-submit-finalise" && (
          <StageAnimationStep key="data-capture" className="gap-8">
            <Email
              cardText="Add your email to receive an email when your withdrawals are complete."
              cardTitle="Notify me when complete"
            />
            <div className="flex flex-col gap-y-4">
              <ValidatorHeader
                selectedCount={withdrawals.length}
                totalCount={activeType2Validators.length}
                onClear={handleResetWithdrawal}
              />

              <WithdrawalValidatorTable
                validators={activeType2Validators}
                withdrawals={withdrawals}
                addWithdrawal={append}
                removeWithdrawal={remove}
                register={register}
                errors={errors}
              />
            </div>
          </StageAnimationStep>
        )}
        {stage.type === "sign-submit-finalise" && (
          <StageAnimationStep key="sign-submit-finalise">
            <ValidatorTable
              headers={SUBMITTING_WITHDRAWAL_COLUMN_HEADERS}
              data={withdrawals.map(
                (w): WithdrawalTableValidatorDetails => ({
                  ...w.validator,
                  transactionStatus: stage.txHashes[w.validator.validatorIndex],
                  withdrawalAmount: w.amount,
                }),
              )}
              wrapperProps={{ clearBackground: true }}
              disableSort
              disablePagination
              renderOverrides={{
                withdrawalAmount: (value) => (
                  <DisplayAmount
                    amount={value.withdrawalAmount}
                    opts={{ decimals: 4 }}
                  />
                ),
              }}
            />
          </StageAnimationStep>
        )}
      </StageAnimationParent>
    </FormProvider>
  );
};

export default Withdrawal;
