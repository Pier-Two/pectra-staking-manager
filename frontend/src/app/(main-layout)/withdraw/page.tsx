"use client";

import { useMemo, type FC, useState } from "react";
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
import type { SortDirection } from "pec/components/batch-deposits/validators/ColumnHeader";
import { WITHDRAWAL_COLUMN_HEADERS } from "pec/constants/columnHeaders";
import { orderBy } from "lodash";

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

  const [sortColumn, setSortColumn] = useState<string | null>(null);
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

  const sortedValidators = (() => {
    if (!sortColumn || !sortDirection || !data) return data;
    return orderBy(data, ["validatorIndex", "balance"], [sortDirection]);
  })();

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
      sortedValidators?.map((validator) => ({
        validator,
        amount: Number(validator.balance) / 10 ** 9, // TODO check decimals
      })) ?? [],
    );

    setValue(
      "selectedValidators",
      sortedValidators?.map((validator) => validator) ?? [],
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
            columnHeaders={WITHDRAWAL_COLUMN_HEADERS}
            onSort={handleSort}
            sortColumn={sortColumn ?? ""}
            sortDirection={sortDirection}
          />

          <div className="flex w-full flex-col gap-y-2">
            {sortedValidators?.map((validator, index) => {
              return (
                <WithdrawalSelectionValidatorCard
                  key={`${index}-${validator.validatorIndex}`}
                  availableAmount={validator.balance}
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
      </div>
    </form>
  );
};

export default Withdrawal;
