"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { cloneDeep, orderBy, sumBy } from "lodash";
import { ArrowUpFromDot } from "lucide-react";
import Image from "next/image";
import type { SortDirection } from "pec/components/batch-deposits/validators/ColumnHeader";
import { ValidatorHeader } from "pec/components/batch-deposits/validators/ValidatorHeader";
import { ValidatorListHeaders } from "pec/components/batch-deposits/validators/ValidatorListHeaders";
import { WithdrawalSelectionValidatorCard } from "pec/components/validators/cards/WithdrawalSelectionValidatorCard";
import { WithdrawalInformation } from "pec/components/withdrawal/WithdrawalInformation";
import { WITHDRAWAL_COLUMN_HEADERS } from "pec/constants/columnHeaders";
import { useValidators } from "pec/hooks/useValidators";
import { useWalletAddress } from "pec/hooks/useWallet";
import { useSubmitWithdraw } from "pec/hooks/useWithdraw";
import {
  WithdrawalFormSchema,
  type WithdrawalFormType,
} from "pec/lib/api/schemas/withdrawal";
import { formatAddressToShortenedString } from "pec/lib/utils/address";
import type { ValidatorDetails } from "pec/types/validator";
import { type FC, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { formatEther } from "viem";
import WithdrawalLoading from "./loading";

const Withdrawal: FC = () => {
  const walletAddress = useWalletAddress();

  const { data: rawValidatorData } = useValidators();
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
    defaultValues: { withdrawals: [] },
    mode: "onChange",
  });

  const { remove, append } = useFieldArray({
    control,
    name: "withdrawals",
  });

  const withdrawals = watch("withdrawals");
  const withdrawalTotal = sumBy(withdrawals, (withdrawal) => withdrawal.amount);

  const [sortColumn, setSortColumn] = useState<string | null>("validator");
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((prev) => {
        if (prev === null) return "asc";
        if (prev === "asc") return "desc";
        return "asc";
      });
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const validators = useMemo(() => {
    if (!sortColumn || !sortDirection) return rawValidatorData;

    return orderBy(
      rawValidatorData,
      [sortColumn as keyof ValidatorDetails],
      [sortDirection],
    );
  }, [rawValidatorData, sortColumn, sortDirection]);

  if (!validators) return <WithdrawalLoading />;

  const handleValidatorSelect = (validator: ValidatorDetails) => {
    // Find if this validator is already in the array
    const existingIndex = withdrawals.findIndex(
      (field) => field.validator.validatorIndex === validator.validatorIndex,
    );

    if (existingIndex === -1) {
      // Add if not found
      append({
        validator: cloneDeep(validator),
        amount: 0,
      });
    } else {
      // Remove if found
      remove(existingIndex);
    }
  };

  const handleMaxAllocation = () => {
    setValue(
      "withdrawals",
      validators.map(
        (validator) => ({
          validator,
          amount: Number(formatEther(validator.balance)),
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
    await submitWithdrawals(data.withdrawals);
  };

  return (
    <div className="flex flex-col gap-y-4">
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
          isValid={isValid && withdrawalTotal > 0}
          onSubmit={handleSubmit(onSubmit)}
          resetWithdrawal={handleResetWithdrawal}
          stage={stage}
          validatorsSelected={withdrawals.length}
          withdrawalTotal={withdrawalTotal}
        />

        <ValidatorHeader
          selectedCount={withdrawals.length}
          totalCount={validators.length}
          onClear={handleResetWithdrawal}
        />

        <div className="flex flex-col items-center gap-4">
          <ValidatorListHeaders
            columns={WITHDRAWAL_COLUMN_HEADERS}
            stage={stage}
            onSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
          />

          <div className="flex w-full flex-col gap-y-2">
            {validators?.map((validator: ValidatorDetails, index: number) => {
              const withdrawalIndex = withdrawals.findIndex(
                (field) =>
                  field.validator.validatorIndex === validator.validatorIndex,
              );
              return (
                <WithdrawalSelectionValidatorCard
                  key={`${index}-${validator.validatorIndex}`}
                  availableAmount={validator.balance}
                  errors={errors}
                  handleSelect={() => handleValidatorSelect(validator)}
                  stage={stage}
                  withdrawalIndex={withdrawalIndex}
                  register={register}
                  selected={withdrawalIndex !== -1}
                  validator={validator}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;
