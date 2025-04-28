import { keyBy, orderBy } from "lodash";
import {
  DEPOSIT_COLUMN_HEADERS,
  DepositTableValidatorDetails,
} from "pec/constants/columnHeaders";
import type { DepositData, DepositType } from "pec/lib/api/schemas/deposit";
import type { EDistributionMethod } from "pec/types/batch-deposits";
import { type ValidatorDetails } from "pec/types/validator";
import { useCallback, useMemo, useState } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { DepositSelectionValidatorCard } from "../../validators/cards/DepositSelectionValidatorCard";
import { type SortDirection } from "./ColumnHeader";
import { ValidatorHeader } from "./ValidatorHeader";
import { ValidatorListHeaders } from "./ValidatorListHeaders";
import { ValidatorTable } from "pec/components/ui/table/ValidatorTable";
import { TableInputField } from "pec/components/ui/table/TableComponents";

export interface ISelectValidatorsProps {
  clearSelectedValidators: () => void;
  distributionMethod: EDistributionMethod;
  handleValidatorSelect: (validator: ValidatorDetails) => void;
  deposits: DepositData[];
  totalAllocated: number;
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
  totalAllocated,
  totalToDistribute,
  validators,
}: ISelectValidatorsProps) => {
  const selectedValidatorIndexes: Record<number, number> = deposits.reduce(
    (acc, field, index) => ({
      ...acc,
      [field.validator.validatorIndex]: index,
    }),
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

    return numValue;
  };

  const depositAmountRowRender = useCallback(
    (validator: ValidatorDetails) => {
      const depositIndex =
        selectedValidatorIndexes[validator.validatorIndex] ?? -1;

      return (
        <TableInputField
          inputProps={{
            disabled: depositIndex === -1,
            ...register(`deposits.${depositIndex}.amount`, {
              setValueAs: (value: string) => setValueHandler(value),
            }),
            onClick: (e) => {
              if (depositIndex === -1) {
                handleValidatorSelect(validator);
              }

              e.stopPropagation();
            },
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
          isSelected: (row) => !!selectedValidatorIndexes[row.validatorIndex],
          showCheckIcons: true,
        }}
      />
    </>
  );
};
