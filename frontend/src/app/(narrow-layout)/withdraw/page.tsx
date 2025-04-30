"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { sumBy } from "lodash";
import { ArrowUpFromDot } from "lucide-react";
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
import {
  FormWithdrawalSchema,
  type FormWithdrawalType,
} from "pec/lib/api/schemas/withdrawal";
import { formatAddressToShortenedString } from "pec/lib/utils/address";
import { type FC, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import WithdrawalLoading from "./loading";

const Withdrawal: FC = () => {
  const walletAddress = useWalletAddress();
  const [showEmail, setShowEmail] = useState(false);
  const { activeType2Validators, isLoading } = useValidators();

  const { submitWithdrawals, stage, setStage } = useSubmitWithdraw();

  const {
    handleSubmit,
    setValue,
    reset,
    control,
    watch,
    register,
    formState: { isValid, errors },
  } = useForm<FormWithdrawalType>({
    resolver: zodResolver(FormWithdrawalSchema),
    defaultValues: { withdrawals: [], email: "" },
    mode: "onChange",
  });

  const { remove, append } = useFieldArray({
    control,
    name: "withdrawals",
  });

  const [withdrawals, watchedEmail] = watch(["withdrawals", "email"]);
  const email = watchedEmail ?? "";
  const withdrawalTotal = sumBy(withdrawals, (withdrawal) => withdrawal.amount);
  const disabled =
    isValid && withdrawalTotal > 0 && (showEmail ? email.length > 0 : true);

  if (isLoading) return <WithdrawalLoading />;

  const handleMaxAllocation = () => {
    setValue(
      "withdrawals",
      activeType2Validators.map(
        (validator) => ({
          validator,
          amount: validator.balance,
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
    <div className="flex w-full flex-col gap-y-2">
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex gap-x-4 text-primary-dark dark:text-indigo-300">
            <ArrowUpFromDot className="h-8 w-8 self-center" />
            <div className="text-3xl font-medium">Withdrawal</div>
          </div>

          <div className="text-base">
            Submit onchain execution layer withdrawal requests against
            validators, as per Pectra EIP-7002.
          </div>
        </div>

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
            availableValidators={activeType2Validators.length}
            validatorsSelected={withdrawals.length}
            withdrawalTotal={withdrawalTotal}
          />
        </div>

        {stage.type !== "sign-submit-finalise" && (
          <>
            <Email
              cardText="Add your email to receive an email when your withdrawals are complete."
              cardTitle="Notify me when complete"
              summaryEmail={email}
              setSummaryEmail={(email) =>
                setValue("email", email, {
                  shouldValidate: true,
                })
              }
              errors={errors}
              showEmail={showEmail}
              setShowEmail={setShowEmail}
            />
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
          </>
        )}
        {stage.type === "sign-submit-finalise" && (
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
        )}
      </div>
    </div>
  );
};

export default Withdrawal;
