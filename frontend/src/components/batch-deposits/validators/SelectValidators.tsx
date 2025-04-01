import { type FC, useState } from "react";
import type { ISelectValidatorsProps } from "pec/types/batch-deposits";
import { DepositSelectionValidatorCard } from "../../validators/cards/DepositSelectionValidatorCard";
import type { ValidatorDetails } from "pec/types/validator";
import { ValidatorHeader } from "./ValidatorHeader";
import { ValidatorListHeaders } from "./ValidatorListHeaders";
import { keyBy } from "lodash";
import { type SortDirection } from "./ColumnHeader";

export const SelectValidators: FC<ISelectValidatorsProps> = ({
  clearSelectedValidators,
  distributionMethod,
  handleDepositAmountChange,
  selectedValidators,
  setSelectedValidators,
  totalAllocated,
  totalToDistribute,
  validators,
}) => {
  const [amountValues, setAmountValues] = useState<number[]>(
    selectedValidators.map((v) => v.depositAmount),
  );
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSetAmountValues = (index: number, amount: number) => {
    setAmountValues((prev) => {
      const newAmountValues = [...prev];
      newAmountValues[index] = amount;
      return newAmountValues;
    });
  };

  const handleValidatorClick = (
    validator: ValidatorDetails,
    depositAmount: number,
  ) => {
    setSelectedValidators({
      validator,
      depositAmount,
    });
  };

  const handleClearValidators = () => {
    clearSelectedValidators();
    setAmountValues(Array(selectedValidators.length).fill(0));
    setSortColumn(null);
    setSortDirection(null);
  };

  const selectedValidatorRecord = keyBy(
    selectedValidators,
    (v) => v.validator.validatorIndex,
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

  const sortedValidators = [...validators].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;

    switch (sortColumn) {
      case "Validator":
        return sortDirection === "asc"
          ? a.validatorIndex - b.validatorIndex
          : b.validatorIndex - a.validatorIndex;

      case "Balance":
        return sortDirection === "asc"
          ? a.balance - b.balance
          : b.balance - a.balance;

      default:
        return 0;
    }
  });

  const columnHeaders = [
    { label: "Validator", showSort: true },
    { label: "Balance", showSort: true },
    { label: "Deposit", showSort: false },
  ];

  return (
    <>
      <ValidatorHeader
        selectedCount={selectedValidators.length}
        totalCount={validators.length}
        onClear={handleClearValidators}
      />

      <div className="flex flex-col items-center gap-4">
        <ValidatorListHeaders
          columnHeaders={columnHeaders}
          onSort={handleSort}
          sortColumn={sortColumn ?? ""}
          sortDirection={sortDirection}
        />

        <div className="flex w-full flex-col gap-y-2">
          {sortedValidators.map((validator, index) => (
            <DepositSelectionValidatorCard
              key={`depositValidator-${validator.validatorIndex}-${index}`}
              amount={amountValues[index] ?? 0}
              setAmount={(amount) => handleSetAmountValues(index, amount)}
              onClick={handleValidatorClick}
              onDepositChange={handleDepositAmountChange}
              validator={validator}
              depositAmount={
                selectedValidatorRecord[validator.validatorIndex]
                  ?.depositAmount ?? 0
              }
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
