import {
  DEPOSIT_COLUMN_HEADERS,
  DepositTableValidatorDetails,
} from "pec/constants/columnHeaders";
import type { DepositData, DepositType } from "pec/lib/api/schemas/deposit";
import { EDistributionMethod } from "pec/types/batch-deposits";
import { type ValidatorDetails } from "pec/types/validator";
import { useCallback, useMemo } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { ValidatorHeader } from "./ValidatorHeader";
import { ValidatorTable } from "pec/components/ui/table/ValidatorTable";
import { AmountInput } from "pec/components/ui/custom/AmountInput";

export interface ISelectValidatorsProps {
  clearSelectedValidators: () => void;
  distributionMethod: EDistributionMethod;
  handleValidatorSelect: (validator: ValidatorDetails) => void;
  deposits: DepositData[];
  totalToDistribute: number;
  validators: ValidatorDetails[];
  errors: FieldErrors<DepositType>;
  register: UseFormRegister<DepositType>;
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

      return (
        <AmountInput
          inputProps={{
            disabled:
              depositIndex === -1 ||
              distributionMethod === EDistributionMethod.SPLIT,
            ...register(`deposits.${depositIndex}.amount`, {
              setValueAs: (value: string) => setValueHandler(value),
            }),
            onClick: (e) => {
              if (depositIndex === -1) {
                handleValidatorSelect(validator);
              }

              e.stopPropagation();
            },
            value,
          }}
          error={
            errors.deposits?.[depositIndex]?.amount
              ? "Please enter a valid amount"
              : undefined
          }
        />
      );
    },
    [register, selectedValidatorIndexes, handleValidatorSelect],
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
        renderOverrides={{ depositAmount: depositAmountRowRender }}
        selectableRows={{
          onClick: (row) => handleValidatorSelect(row),
          isSelected: (row) =>
            selectedValidatorIndexes[row.validatorIndex] !== undefined,
          showCheckIcons: true,
        }}
        disablePagination
      />
    </>
  );
};
