"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { sumBy } from "lodash";
import { ArrowUpFromDot } from "lucide-react";
import Image from "next/image";
import { ValidatorHeader } from "pec/components/batch-deposits/validators/ValidatorHeader";
import { Email } from "pec/components/consolidation/summary/Email";
import { WithdrawalInformation } from "pec/components/withdrawal/WithdrawalInformation";
import { useValidators } from "pec/hooks/useValidators";
import { useWalletAddress } from "pec/hooks/useWallet";
import { useSubmitWithdraw } from "pec/hooks/useWithdraw";
import {
  WithdrawalFormSchema,
  type WithdrawalFormType,
} from "pec/lib/api/schemas/withdrawal";
import { formatAddressToShortenedString } from "pec/lib/utils/address";
import { ValidatorStatus } from "pec/types/validator";
import { type FC, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import WithdrawalLoading from "./loading";
import { WithdrawalValidatorTable } from "pec/components/withdrawal/WithdrawalValidatorTable";
import { SubmittingTransactionsTable } from "pec/components/ui/table/SubmittingTransactionsTable";

const Withdrawal: FC = () => {
  const walletAddress = useWalletAddress();
  const [showEmail, setShowEmail] = useState(false);
  const { groupedValidators, isLoading } = useValidators();

  const availableValidators = groupedValidators[ValidatorStatus.ACTIVE] ?? [];

  const { submitWithdrawals, stage, setStage } = useSubmitWithdraw();

  const {
    handleSubmit,
    setValue,
    reset,
    control,
    watch,
    register,
    formState: { isValid, errors },
  } = useForm<WithdrawalFormType>({
    resolver: zodResolver(WithdrawalFormSchema),
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
      availableValidators.map(
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

  const onSubmit = async (data: WithdrawalFormType) => {
    await submitWithdrawals(data.withdrawals, data.email ?? "");
  };

  return (
    <div className="flex w-full flex-col gap-y-4">
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex gap-x-4 text-indigo-800 dark:text-indigo-300">
            <ArrowUpFromDot className="h-8 w-8" />
            <div className="text-2xl font-medium">Withdrawal</div>
          </div>

          <div className="text-sm text-gray-700 dark:text-gray-300">
            Submit onchain execution layer withdrawal requests against
            validators, as per Pectra EIP-7002.
          </div>
        </div>

        <div className="ms-4 flex flex-row items-center gap-3">
          <Image
            className="h-4 w-4"
            src="/icons/Wallet.svg"
            alt="Withdrawal Wallet"
            width={16}
            height={16}
          />

          <div className="text-sm">Withdrawal address</div>
          <div className="text-sm text-gray-500 dark:text-gray-300">
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
              totalCount={availableValidators.length}
              onClear={handleResetWithdrawal}
            />

            <WithdrawalValidatorTable
              validators={availableValidators}
              withdrawals={withdrawals}
              addWithdrawal={append}
              removeWithdrawal={remove}
              register={register}
              errors={errors}
            />
          </>
        )}
        {stage.type === "sign-submit-finalise" && (
          <SubmittingTransactionsTable
            validators={withdrawals.map((w) => w.validator)}
            txHashRecord={stage.txHashes}
          />
        )}
      </div>
    </div>
  );
};

export default Withdrawal;
