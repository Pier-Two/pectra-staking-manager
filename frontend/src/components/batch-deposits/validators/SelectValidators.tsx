import { keyBy, orderBy } from "lodash";
import { DEPOSIT_COLUMN_HEADERS } from "pec/constants/columnHeaders";
import type { DepositData, DepositType } from "pec/lib/api/schemas/deposit";
import type { EDistributionMethod } from "pec/types/batch-deposits";
import { ValidatorStatus, type ValidatorDetails } from "pec/types/validator";
import { useMemo, useState } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { DepositSelectionValidatorCard } from "../../validators/cards/DepositSelectionValidatorCard";
import { type SortDirection } from "./ColumnHeader";
import { ValidatorHeader } from "./ValidatorHeader";
import { ValidatorListHeaders } from "./ValidatorListHeaders";
import { validatorIsActive } from "pec/lib/utils/validators/status";

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
  const availableValidators = useMemo(() => {
    return validators.filter((validator) => validatorIsActive(validator));
  }, [validators]);

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleClearValidators = () => {
    clearSelectedValidators();
    setSortColumn(null);
    setSortDirection(null);
  };

  const depositRecord = keyBy(deposits, (v) => v.validator.validatorIndex);

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
    if (!sortColumn || !sortDirection || !availableValidators)
      return availableValidators;

    return orderBy(
      availableValidators,
      ["validatorIndex", "balance"],
      [sortDirection],
    );
  })();

  return (
    <>
      <ValidatorHeader
        selectedCount={deposits.length}
        totalCount={availableValidators?.length ?? 0}
        onClear={handleClearValidators}
      />

      <div className="flex flex-col items-center gap-4">
        <ValidatorListHeaders
          columnHeaders={DEPOSIT_COLUMN_HEADERS}
          onSort={handleSort}
          sortColumn={sortColumn ?? ""}
          sortDirection={sortDirection}
        />

        <div className="flex w-full flex-col gap-y-2">
          {sortedValidators?.map((validator) => {
            const depositIndex = deposits.findIndex(
              (d) => d.validator.validatorIndex === validator.validatorIndex,
            );
            return (
              <DepositSelectionValidatorCard
                key={`depositValidator-${validator.validatorIndex}`}
                depositIndex={depositIndex}
                depositAmount={deposits[depositIndex]?.amount ?? 0}
                errors={errors}
                handleSelect={() => handleValidatorSelect(validator)}
                register={register}
                validator={validator}
                distributionMethod={distributionMethod}
                selected={!!depositRecord[validator.validatorIndex]}
                totalAllocated={totalAllocated}
                totalToDistribute={totalToDistribute}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};
