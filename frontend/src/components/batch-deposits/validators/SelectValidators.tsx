import { type FC, useState } from "react";
import type { ISelectValidatorsProps } from "pec/types/batch-deposits";
import { DepositSelectionValidatorCard } from "../../validators/cards/DepositSelectionValidatorCard";
import { ValidatorHeader } from "./ValidatorHeader";
import { ValidatorListHeaders } from "./ValidatorListHeaders";
import { keyBy, orderBy } from "lodash";
import { type SortDirection } from "./ColumnHeader";
import { DEPOSIT_COLUMN_HEADERS } from "pec/constants/columnHeaders";
import type { DepositType } from "pec/lib/api/schemas/deposit";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

interface ExtendedProps extends ISelectValidatorsProps {
  errors: FieldErrors<DepositType>;
  register: UseFormRegister<DepositType>;
}

export const SelectValidators: FC<ExtendedProps> = ({
  clearSelectedValidators,
  distributionMethod,
  errors,
  register,
  handleValidatorSelect,
  selectedValidators,
  totalAllocated,
  totalToDistribute,
  watchedDeposits,
  validators,
}) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleClearValidators = () => {
    clearSelectedValidators();
    setSortColumn(null);
    setSortDirection(null);
  };

  const selectedValidatorRecord = keyBy(
    selectedValidators,
    (v) => v.validatorIndex,
  );

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
    if (!sortColumn || !sortDirection || !validators) return validators;
    return orderBy(validators, ["validatorIndex", "balance"], [sortDirection]);
  })();

  return (
    <>
      <ValidatorHeader
        selectedCount={selectedValidators.length}
        totalCount={validators.length}
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
          {sortedValidators.map((validator, index) => (
            <DepositSelectionValidatorCard
              key={`depositValidator-${validator.validatorIndex}-${index}`}
              index={index}
              depositAmount={watchedDeposits[index]?.amount ?? 0}
              errors={errors}
              handleSelect={() => handleValidatorSelect(validator)}
              register={register}
              validator={validator}
              distributionMethod={distributionMethod}
              selected={!!selectedValidatorRecord[validator.validatorIndex]}
              totalAllocated={totalAllocated}
              totalToDistribute={totalToDistribute}
            />
          ))}
        </div>
      </div>
    </>
  );
};
