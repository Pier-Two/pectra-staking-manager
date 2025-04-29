import {
  WITHDRAWAL_COLUMN_HEADERS,
  WithdrawalTableValidatorDetails,
} from "pec/constants/columnHeaders";
import type { WithdrawalFormType } from "pec/lib/api/schemas/withdrawal";
import { cn } from "pec/lib/utils";
import type { ValidatorDetails } from "pec/types/validator";
import { useCallback, useMemo } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "../ui/input";
import { ValidatorTable } from "../ui/table/ValidatorTable";
import { AmountInput } from "../ui/custom/AmountInput";

interface WithdrawalValidatorTable {
  validators: ValidatorDetails[];
  withdrawals: WithdrawalFormType["withdrawals"];
  addWithdrawal: (withdrawal: WithdrawalFormType["withdrawals"][0]) => void;
  removeWithdrawal: (index: number) => void;
  register: UseFormRegister<WithdrawalFormType>;
  errors: FieldErrors<WithdrawalFormType>;
}

export const WithdrawalValidatorTable = ({
  validators,
  withdrawals,
  register,
  errors,
  addWithdrawal,
  removeWithdrawal,
}: WithdrawalValidatorTable) => {
  const selectedValidatorIndexes: Record<number, number> = withdrawals.reduce(
    (acc, field, index) => ({
      ...acc,
      [field.validator.validatorIndex]: index,
    }),
    {},
  );

  const handleValidatorSelect = (validator: ValidatorDetails) => {
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
  };
  const setValueHandler = (value: string, validatorBalance: number) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 0;

    if (numValue > validatorBalance) return validatorBalance;

    return numValue;
  };

  const withdrawalAmountRowRender = useCallback(
    (validator: ValidatorDetails) => {
      const withdrawalIndex =
        selectedValidatorIndexes[validator.validatorIndex] ?? -1;

      return (
        <AmountInput
          inputProps={{
            disabled: withdrawalIndex === -1,
            ...register(`withdrawals.${withdrawalIndex}.amount`, {
              setValueAs: (value: string) =>
                setValueHandler(value, validator.balance),
            }),
            onClick: (e) => {
              if (withdrawalIndex === -1) {
                handleValidatorSelect(validator);
              }

              e.stopPropagation();
            },
          }}
          error={
            errors.withdrawals?.[withdrawalIndex]?.amount
              ? "Please enter an amount less than or equal to your available balance"
              : undefined
          }
        />
      );
    },
    [register, errors, selectedValidatorIndexes],
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
