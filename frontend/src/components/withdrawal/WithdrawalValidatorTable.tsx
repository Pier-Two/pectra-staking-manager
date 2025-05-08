import {
  WITHDRAWAL_COLUMN_HEADERS,
  type WithdrawalTableValidatorDetails,
} from "pec/constants/columnHeaders";
import type { FormWithdrawalType } from "pec/lib/api/schemas/withdrawal";
import type { ValidatorDetails } from "pec/types/validator";
import { useCallback, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ValidatorTable } from "../ui/table/ValidatorTable";
import { AmountInput } from "../ui/custom/AmountInput";
import { SecondaryButton } from "../ui/custom/SecondaryButton";
import { cn } from "pec/lib/utils";

interface WithdrawalValidatorTable {
  validators: ValidatorDetails[];
  withdrawals: FormWithdrawalType["withdrawals"];
  addWithdrawal: (withdrawal: FormWithdrawalType["withdrawals"][0]) => void;
  removeWithdrawal: (index: number) => void;
}

const setValueHandler = (value: string, validatorBalance: number) => {
  const numValue = parseFloat(value);

  // if NaN, return 0
  if (isNaN(numValue)) return 0;

  // allow full exit through
  if (numValue === validatorBalance) return validatorBalance;

  // if greater than balance, return balance
  if (numValue > validatorBalance) return validatorBalance;

  // if between 0 and balance - 32, return numValue
  if (numValue > 0 && numValue < validatorBalance - 32) return numValue;

  // if between balance - 32 and balance, return balance - 32
  return validatorBalance - 32;
};

export const WithdrawalValidatorTable = ({
  validators,
  withdrawals,
  addWithdrawal,
  removeWithdrawal,
}: WithdrawalValidatorTable) => {
  const {
    setValue,
    control,
    formState: { errors },
    watch,
  } = useFormContext<FormWithdrawalType>();

  const selectedValidatorIndexes: Record<number, number> = withdrawals.reduce(
    (acc, field, index) => ({
      ...acc,
      [field.validator.validatorIndex]: index,
    }),
    {},
  );

  const handleValidatorSelect = useCallback(
    (validator: ValidatorDetails) => {
      // Find if this validator is already in the array
      const existingIndex =
        selectedValidatorIndexes[validator.validatorIndex] ?? -1;

      if (existingIndex === -1) {
        // Add if not found
        addWithdrawal({
          validator,
          amount: validator.balance,
        });
      } else {
        // Remove if found
        removeWithdrawal(existingIndex);
      }
    },
    [addWithdrawal, removeWithdrawal, selectedValidatorIndexes],
  );

  const WithdrawButtons = ({
    validator,
    withdrawalIndex,
  }: {
    validator: ValidatorDetails;
    withdrawalIndex: number;
  }) => {
    const withdrawalAmount = watch(`withdrawals.${withdrawalIndex}.amount`);

    return (
      <>
        <SecondaryButton
          label="Max Partial"
          className={cn("h-12 text-nowrap", {
            "bg-indigo-500 text-white hover:bg-indigo-500 hover:text-white":
              withdrawalAmount === validator.balance - 32,
          })}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();

            if (withdrawalIndex === -1) {
              addWithdrawal({
                validator,
                amount: validator.balance - 32,
              });
            }

            setValue(
              `withdrawals.${withdrawalIndex}.amount`,
              setValueHandler(
                validator.balance.toString(),
                validator.balance - 32,
              ),
            );
          }}
        />
        <SecondaryButton
          label="Full Exit"
          className={cn("h-12 text-nowrap text-red-500 hover:text-red-500", {
            "bg-red-500 text-white hover:bg-red-500 hover:text-white":
              withdrawalAmount === validator.balance,
          })}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();

            if (withdrawalIndex === -1) {
              addWithdrawal({
                validator,
                amount: validator.balance,
              });
            }

            setValue(
              `withdrawals.${withdrawalIndex}.amount`,
              setValueHandler(validator.balance.toString(), validator.balance),
            );
          }}
        />
      </>
    );
  };

  const withdrawalAmountRowRender = useCallback(
    (validator: ValidatorDetails) => {
      const withdrawalIndex =
        selectedValidatorIndexes[validator.validatorIndex] ?? -1;

      if (withdrawalIndex === -1) {
        return (
          <div className="flex flex-row items-center gap-2">
            <AmountInput
              inputProps={{
                value: "0",
                className: "text-gray-400",
                onClick: () => {
                  handleValidatorSelect(validator);
                },
              }}
            />
            <WithdrawButtons
              validator={validator}
              withdrawalIndex={withdrawalIndex}
            />
          </div>
        );
      }

      return (
        <div className="flex flex-row items-center gap-2">
          <Controller
            control={control}
            name={`withdrawals.${withdrawalIndex}.amount`}
            render={({ field: { value, onChange, ...rest } }) => (
              <>
                <AmountInput
                  inputProps={{
                    value: `${value}`,
                    onChange: (e) => {
                      onChange(
                        setValueHandler(e.target.value, validator.balance),
                      );
                    },
                    onClick: () => {
                      if (withdrawalIndex === -1) {
                        handleValidatorSelect(validator);
                      }
                    },
                    ...rest,
                  }}
                  error={
                    errors.withdrawals?.[withdrawalIndex]?.amount
                      ? (errors.withdrawals?.[withdrawalIndex]?.amount
                          .message ??
                        "Please enter an amount less than or equal to your available balance")
                      : undefined
                  }
                />
                <WithdrawButtons
                  validator={validator}
                  withdrawalIndex={withdrawalIndex}
                />
              </>
            )}
          />
        </div>
      );
    },
    [
      selectedValidatorIndexes,
      control,
      errors.withdrawals,
      handleValidatorSelect,
    ],
  );

  const validatorDetailsRow: WithdrawalTableValidatorDetails[] = useMemo(
    () =>
      validators.map((validator) => {
        const withdrawalIndex =
          selectedValidatorIndexes[validator.validatorIndex] ?? -1;

        return {
          ...validator,
          withdrawalAmount: withdrawals[withdrawalIndex]?.amount ?? 0,
        };
      }),
    [validators, withdrawals, selectedValidatorIndexes],
  );

  return (
    <ValidatorTable
      data={validatorDetailsRow}
      headers={WITHDRAWAL_COLUMN_HEADERS}
      disablePagination
      selectableRows={{
        onClick: handleValidatorSelect,
        showCheckIcons: true,
        isSelected: (row) =>
          selectedValidatorIndexes[row.validatorIndex] !== undefined,
      }}
      renderOverrides={{
        withdrawalAmount: withdrawalAmountRowRender,
      }}
    />
  );
};
