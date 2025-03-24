import { type FC } from "react";
import {
  EDistributionMethod,
  type ISelectValidators,
} from "pec/types/batch-deposits";
import { ChevronsUpDown, X } from "lucide-react";
import { DepositSelectionValidatorCard } from "../validators/cards/DepositSelectionValidatorCard";
import type { ValidatorDetails } from "pec/types/validator";
import { TertiaryButton } from "../ui/custom/TertiaryButton";
import { EIconPosition } from "pec/types/components";

export const SelectValidators: FC<ISelectValidators> = (props) => {
  const {
    clearSelectedValidators,
    distributionMethod,
    selectedValidators,
    setSelectedValidators,
    totalAllocated,
    totalToDistribute,
    validators,
  } = props;

  const calculateDepositAmount = (
    distributionMethod: EDistributionMethod,
    depositAmount: number,
  ): number => {
    if (distributionMethod === EDistributionMethod.SPLIT)
      return totalToDistribute / (selectedValidators.length + 1);
    else return depositAmount;
  };

  const handleValidatorClick = (
    validator: ValidatorDetails,
    distributionMethod: EDistributionMethod,
    depositAmount: number,
  ) => {
    const calculatedDepositAmount = calculateDepositAmount(
      distributionMethod,
      depositAmount,
    );

    console.log("calculatedDepositAmount: ", calculatedDepositAmount);

    setSelectedValidators({
      validator,
      depositAmount: calculatedDepositAmount,
    });
  };

  const handleClearSelectedValidators = () => {
    clearSelectedValidators();
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="text-lg">Select Validators</div>
        <div className="flex flex-row gap-4 items-center">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {selectedValidators.length} / {validators.length} selected
          </div>

          <TertiaryButton
            className="text-indigo-800 border-indigo-200"
            label={"Clear"}
            icon={<X />}
            iconPosition={EIconPosition.LEFT}
            onClick={handleClearSelectedValidators}
            disabled={false}
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex-col-3 flex w-full justify-between">
          <div className="flex items-center gap-2">
            <div className="text-md text-gray-700 dark:text-gray-300">
              Validator
            </div>
            <ChevronsUpDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </div>

          <div className="text-md text-gray-700 dark:text-gray-300">
            Balance
          </div>

          <div className="flex items-center gap-2">
            <div className="text-md text-gray-700 dark:text-gray-300">
              Deposit
            </div>
            <ChevronsUpDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </div>
        </div>

        {validators.map((validator, index) => (
          <DepositSelectionValidatorCard
            key={`depositValidator-${validator.validatorIndex}-${index}`}
            onClick={handleValidatorClick}
            validator={validator}
            depositAmount={
              selectedValidators.find(
                (v) => v.validator.validatorIndex === validator.validatorIndex,
              )?.depositAmount ?? 0
            }
            distributionMethod={distributionMethod}
            selected={
              selectedValidators.some(
                (v) => v.validator.validatorIndex === validator.validatorIndex,
              ) ?? false
            }
            totalAllocated={totalAllocated}
            totalToDistribute={totalToDistribute}
          />
        ))}
      </div>
    </>
  );
};
