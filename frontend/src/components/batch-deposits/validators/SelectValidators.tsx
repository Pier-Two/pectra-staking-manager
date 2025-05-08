import {
  DEPOSIT_COLUMN_HEADERS,
  type DepositTableValidatorDetails,
} from "pec/constants/columnHeaders";
import type {
  FormDepositData,
  FormDepositType,
} from "pec/lib/api/schemas/deposit";
import { EDistributionMethod } from "pec/types/batch-deposits";
import { type ValidatorDetails } from "pec/types/validator";
import { useCallback, useMemo } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { ValidatorHeader } from "./ValidatorHeader";
import { ValidatorTable } from "pec/components/ui/table/ValidatorTable";
import { AmountInput } from "pec/components/ui/custom/AmountInput";
import { MAX_VALIDATOR_BALANCE } from "pec/constants/deposit";
import { DisplayAmount } from "pec/components/ui/table/TableComponents";

export interface ISelectValidatorsProps {
  clearSelectedValidators: () => void;
  distributionMethod: EDistributionMethod;
  handleValidatorSelect: (validator: ValidatorDetails) => void;
  deposits: FormDepositData[];
  totalToDistribute: number;
  validators: ValidatorDetails[];
  errors: FieldErrors<FormDepositType>;
  register: UseFormRegister<FormDepositType>;
  depositExceedsRemaining: boolean;
}

export const SelectValidators = ({
  clearSelectedValidators,
  distributionMethod,
  errors,
  register,
  handleValidatorSelect,
  deposits,
  totalToDistribute,
  validators,
  depositExceedsRemaining,
}: ISelectValidatorsProps) => {
  const selectedValidatorIndexes = deposits.reduce<Record<number, number>>(
    (acc, field, index) => {
      acc[field.validator.validatorIndex] = index;
      return {
        ...acc,
        [field.validator.validatorIndex]: index,
      };
    },
    {},
  );

  const handleClearValidators = () => {
    clearSelectedValidators();
  };

  const validatorDetailsRow: DepositTableValidatorDetails[] = useMemo(
    () =>
      validators.map((v): DepositTableValidatorDetails => {
        const depositIndex = selectedValidatorIndexes[v.validatorIndex] ?? -1;

        return {
          ...v,
          depositAmount: deposits[depositIndex]?.amount ?? 0,
        };
      }),
    [deposits, selectedValidatorIndexes, validators],
  );

  const setValueHandler = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 0;

    if (
      distributionMethod === EDistributionMethod.SPLIT &&
      numValue > totalToDistribute
    )
      return totalToDistribute;

    return numValue;
  };

  const depositAmountRowRender = useCallback(
    (validator: ValidatorDetails) => {
      const depositIndex =
        selectedValidatorIndexes[validator.validatorIndex] ?? -1;
      const value = depositIndex === -1 ? 0 : undefined;
      const isSelected = depositIndex !== -1;
      const depositAmount = deposits[depositIndex]?.amount ?? 0;
      const remainingBalance = MAX_VALIDATOR_BALANCE - validator.balance;
      const invalidAmount =
        (depositAmount < 1 && isSelected) || remainingBalance < depositAmount;

      return (
        <AmountInput
          inputProps={{
            disabled:
              depositIndex === -1 ||
              distributionMethod === EDistributionMethod.SPLIT,
            ...register(`deposits.${depositIndex}.amount`, {
              setValueAs: (value: string) => setValueHandler(value),
            }),
            onClick: () => {
              if (!isSelected) {
                handleValidatorSelect(validator);
              }
            },
            value,
          }}
          invalidAmount={invalidAmount}
          error={
            errors.deposits?.[depositIndex]?.amount
              ? "Please enter a valid amount"
              : undefined
          }
        />
      );
    },
    [
      register,
      selectedValidatorIndexes,
      handleValidatorSelect,
      deposits,
      errors,
      distributionMethod,
    ],
  );

  return (
    <>
      <ValidatorHeader
        selectedCount={deposits.length}
        totalCount={validators?.length ?? 0}
        onClear={handleClearValidators}
      />
      <ValidatorTable
        data={validatorDetailsRow}
        headers={DEPOSIT_COLUMN_HEADERS}
        renderOverrides={{
          depositAmount: depositAmountRowRender,
          balance: (validator) => (
            <DisplayAmount amount={validator.balance}>
              <div className="mt-1 font-inter text-xs font-light text-piertwo-text">
                <span className="hidden md:contents">Ξ</span>
                {(MAX_VALIDATOR_BALANCE - validator.balance).toFixed(2)}{" "}
                remaining
              </div>
            </DisplayAmount>
          ),
        }}
        selectableRows={{
          onClick: (row) => handleValidatorSelect(row),
          isSelected: (row) =>
            selectedValidatorIndexes[row.validatorIndex] !== undefined,
          showCheckIcons: true,
        }}
        disablePagination
      />
      {depositExceedsRemaining && (
        <p className="text-xs text-red-500">
          The amount you are trying to deposit exceeds the remaining balance of
          one or more validators. To make adjustments please choose Manual entry
          or adjust Total Amount
        </p>
      )}
    </>
  );
};
