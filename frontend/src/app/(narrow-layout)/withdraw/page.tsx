"use client";

import { useMemo, type FC } from "react";
import { api } from "pec/trpc/react";
import { useWalletAddress } from "pec/hooks/useWallet";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import WithdrawalLoading from "./loading";
import { ArrowUpFromDot } from "lucide-react";
import Image from "next/image";
import { EWithdrawalStage } from "pec/types/withdrawal";
import { WithdrawalInformation } from "pec/components/withdrawal/WithdrawalInformation";
import { WithdrawalSelectionValidatorCard } from "pec/components/validators/cards/WithdrawalSelectionValidatorCard";
import { ValidatorListHeaders } from "pec/components/batch-deposits/validators/ValidatorListHeaders";
import {
  WithdrawalSchema,
  type WithdrawalType,
} from "pec/lib/api/schemas/withdrawal";
import type { ValidatorDetails } from "pec/types/validator";
import { ValidatorHeader } from "pec/components/batch-deposits/validators/ValidatorHeader";

const Withdrawal: FC = () => {
  const walletAddress = useWalletAddress();

  const { data, isFetched } = api.validators.getValidators.useQuery(
    {
      address: walletAddress || "",
    },
    { enabled: !!walletAddress },
  );

  const initialValues: WithdrawalType = {
    selectedValidators: [],
    stage: EWithdrawalStage.DATA_CAPTURE,
    withdrawals:
      data?.map((validator) => ({
        validator,
        amount: 0,
      })) ?? [],
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isValid, errors },
  } = useForm<WithdrawalType>({
    resolver: zodResolver(WithdrawalSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const { fields: withdrawals } = useFieldArray({
    control,
    name: "withdrawals",
  });

  const { append, remove } = useFieldArray({
    control,
    name: "selectedValidators",
  });

  const watchedWithdrawals = useWatch({
    control,
    name: "withdrawals",
  });

  const watchedSelectedValidators = useWatch({
    control,
    name: "selectedValidators",
  });

  const stage = useWatch({
    control,
    name: "stage",
  });

  const withdrawalTotal = useMemo(() => {
    return watchedWithdrawals.reduce(
      (acc, withdrawal) => acc + (withdrawal.amount ?? 0),
      0,
    );
  }, [watchedWithdrawals]);

  if (!walletAddress || !data || !isFetched) return <WithdrawalLoading />;

  const handleValidatorSelect = (validator: ValidatorDetails) => {
    const existingIndex = watchedSelectedValidators.findIndex(
      (selectedValidator) =>
        selectedValidator.validatorIndex === validator.validatorIndex,
    );

    if (existingIndex !== -1) remove(existingIndex);
    else append(validator);
  };

  const handleMaxAllocation = () => {
    setValue(
      "withdrawals",
      data.map((validator) => ({
        validator,
        amount: Math.max(validator.balance - 32, 0),
      })),
    );

    setValue(
      "selectedValidators",
      data.map((validator) => validator),
    );
  };

  const handleResetWithdrawal = () => {
    reset(initialValues);
  };

  const onSubmit = (data: WithdrawalType, realSubmit = false) => {
    // TODO Max
    if (realSubmit) {
      const filteredData = data.withdrawals.filter(
        (withdrawal) => withdrawal.amount > 0,
      );
      console.log("onSubmit for withdrawal HIT: ", filteredData);
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
            <ArrowUpFromDot className="h-10 w-10" />
            <div className="text-3xl">Partial Withdrawal</div>
          </div>

          <div className="w-[45vw] text-gray-700 dark:text-gray-300">
            Submit onchain execution layer withdrawal requests against
            validators, as per Pectra EIP-7002.
          </div>
        </div>

        <div className="flex flex-row items-center gap-4">
          <Image
            className="h-4 w-4"
            src="/icons/Wallet.svg"
            alt="Withdrawal Wallet"
            width={16}
            height={16}
          />

          <div>Withdrawal address</div>
          <div className="text-gray-500 dark:text-gray-300">
            {walletAddress.slice(0, 5)}...{walletAddress.slice(-5)}
          </div>
        </div>

        <WithdrawalInformation
          buttonText="Withdraw"
          handleMaxAllocation={handleMaxAllocation}
          isValid={
            isValid &&
            watchedSelectedValidators.length > 0 &&
            withdrawalTotal > 0
          }
          onSubmit={handleSubmit((data) => onSubmit(data, true))}
          resetWithdrawal={handleResetWithdrawal}
          stage={stage}
          validatorsSelected={watchedSelectedValidators.length}
          withdrawalTotal={withdrawalTotal}
        />

        <ValidatorHeader
          selectedCount={watchedSelectedValidators.length}
          totalCount={data.length}
          onClear={handleResetWithdrawal}
        />

        <div className="flex flex-col items-center gap-4">
          <ValidatorListHeaders
            labels={["Validator", "Balance", "Withdrawal"]}
          />

          {data.map((validator, index) => {
            return (
              <WithdrawalSelectionValidatorCard
                key={`${index}-${validator.validatorIndex}`}
                availableAmount={Math.max(validator.balance - 32, 0)}
                errors={errors}
                handleSelect={() => handleValidatorSelect(validator)}
                index={index}
                register={register}
                selected={watchedSelectedValidators.some(
                  (v) => v.validatorIndex === validator.validatorIndex,
                )}
                validator={validator}
              />
            );
          })}
        </div>
      </div>
    </form>
  );
};

export default Withdrawal;
