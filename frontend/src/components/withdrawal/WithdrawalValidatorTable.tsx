import {
  NEW_WITHDRAWAL_COLUMN_HEADERS,
  WithdrawalTableValidatorDetails,
} from "pec/constants/columnHeaders";
import { ValidatorTable } from "../ui/table/ValidatorTable";
import { WithdrawalFormType } from "pec/lib/api/schemas/withdrawal";
import { ValidatorDetails } from "pec/types/validator";
import { Input } from "../ui/input";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useCallback, useMemo } from "react";

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
        amount: 0,
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
      const locked = validator.balance === 0 || withdrawalIndex === -1;

      return (
        <div className="flex w-full flex-col">
          <div className="flex flex-row items-center gap-2">
            <span className="text-sm">ETH</span>
            <Input
              className={`w-full rounded-xl border border-indigo-300 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-black dark:text-gray-300 ${locked ? "opacity-50" : ""}`}
              type="number"
              step="any"
              {...register(`withdrawals.${withdrawalIndex}.amount`, {
                setValueAs: (value: string) =>
                  setValueHandler(value, validator.balance),
              })}
              onClick={(e) => {
                if (withdrawalIndex === -1) {
                  handleValidatorSelect(validator);
                }

                e.stopPropagation();
              }}
            />
          </div>

          {errors.withdrawals?.[withdrawalIndex]?.amount && (
            <div className="mt-1 text-xs text-red-500">
              Please enter an amount less than or equal to your available
              balance.
            </div>
          )}
        </div>
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
      headers={NEW_WITHDRAWAL_COLUMN_HEADERS}
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
