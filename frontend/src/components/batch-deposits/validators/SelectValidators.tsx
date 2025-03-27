import { type FC, useState } from "react";
import type { ISelectValidatorsProps } from "pec/types/batch-deposits";
import { DepositSelectionValidatorCard } from "../../validators/cards/DepositSelectionValidatorCard";
import type { ValidatorDetails } from "pec/types/validator";
import { ValidatorHeader } from "./ValidatorHeader";
import { ValidatorListHeaders } from "./ValidatorListHeaders";
import { keyBy } from "lodash";

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
  };

  const selectedValidatorRecord = keyBy(
    selectedValidators,
    (v) => v.validator.validatorIndex,
  );

  return (
    <>
      <ValidatorHeader
        selectedCount={selectedValidators.length}
        totalCount={validators.length}
        onClear={handleClearValidators}
      />

      <div className="flex flex-col items-center gap-4">
        <ValidatorListHeaders labels={["Validator", "Balance", "Deposit"]} />

        {validators.map((validator, index) => (
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
    </>
  );
};
