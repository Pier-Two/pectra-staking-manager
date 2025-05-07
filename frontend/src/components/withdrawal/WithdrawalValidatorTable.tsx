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

interface WithdrawalValidatorTable {
  validators: ValidatorDetails[];
  withdrawals: FormWithdrawalType["withdrawals"];
  addWithdrawal: (withdrawal: FormWithdrawalType["withdrawals"][0]) => void;
  removeWithdrawal: (index: number) => void;
}

const setValueHandler = (value: string, validatorBalance: number) => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return 0;

  if (numValue > validatorBalance) return validatorBalance;

  return numValue;
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
  } = useFormContext<FormWithdrawalType>();

  const selectedValidatorIndexes: Record<number, number> = withdrawals.reduce(
    (acc, field, index) => ({
      ...acc,
      [field.validator.validatorIndex]: index,
    }),
    {},
  );

  const handleValidatorSelect = useCallback(
    (validator: ValidatorDetails, withBalance = true) => {
      // Find if this validator is already in the array
      const existingIndex =
        selectedValidatorIndexes[validator.validatorIndex] ?? -1;

      if (existingIndex === -1) {
        // Add if not found
        addWithdrawal({
          validator,
          amount: withBalance ? validator.balance : 0,
        });
      } else {
        // Remove if found
        removeWithdrawal(existingIndex);
      }
    },
    [addWithdrawal, removeWithdrawal, selectedValidatorIndexes],
  );

  const withdrawalAmountRowRender = useCallback(
    (validator: ValidatorDetails) => {
      const withdrawalIndex =
        selectedValidatorIndexes[validator.validatorIndex] ?? -1;

      if (withdrawalIndex === -1) {
        return (
          <div className="flex flex-row items-center gap-2">
            <AmountInput
              inputProps={{
                disabled: true,
                value: "0",
              }}
              error={
                errors.withdrawals?.[withdrawalIndex]?.amount
                  ? "Please enter an amount less than or equal to your available balance"
                  : undefined
              }
            />
            <SecondaryButton
              label="Max Partial"
              className="h-12 text-nowrap"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (withdrawalIndex === -1) {
                  handleValidatorSelect(validator, false);
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
              className="h-12 text-nowrap text-red-500 hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (withdrawalIndex === -1) {
                  handleValidatorSelect(validator, false);
                }
                setValue(
                  `withdrawals.${withdrawalIndex}.amount`,
                  setValueHandler(
                    validator.balance.toString(),
                    validator.balance,
                  ),
                );
              }}
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
                    disabled: withdrawalIndex === -1,
                    value: `${value}`,
                    onChange: (e) => {
                      onChange(
                        setValueHandler(e.target.value, validator.balance),
                      );
                    },
                    onClick: (e) => {
                      if (withdrawalIndex === -1) {
                        handleValidatorSelect(validator);
                      }

                      e.stopPropagation();
                    },
                    ...rest,
                  }}
                  error={
                    errors.withdrawals?.[withdrawalIndex]?.amount
                      ? "Please enter an amount less than or equal to your available balance"
                      : undefined
                  }
                />
                <SecondaryButton
                  label="Max Partial"
                  className="h-12 text-nowrap"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (withdrawalIndex === -1) {
                      handleValidatorSelect(validator);
                    }
                    onChange(
                      setValueHandler(
                        validator.balance.toString(),
                        validator.balance - 32,
                      ),
                    );
                  }}
                />
                <SecondaryButton
                  label="Full Exit"
                  className="h-12 text-nowrap text-red-500 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (withdrawalIndex === -1) {
                      handleValidatorSelect(validator);
                    }
                    onChange(
                      setValueHandler(
                        validator.balance.toString(),
                        validator.balance,
                      ),
                    );
                  }}
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
