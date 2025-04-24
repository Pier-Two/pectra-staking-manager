import { CircleCheck, CircleMinus, CirclePlus } from "lucide-react";
import Image from "next/image";
import { ValidatorCardWrapper } from "pec/components/ui/custom/validator-card-wrapper";
import { Input } from "pec/components/ui/input";
import type { DepositType } from "pec/lib/api/schemas/deposit";
import { cn } from "pec/lib/utils";
import { displayedEthAmount } from "pec/lib/utils/validators/balance";
import { EDistributionMethod } from "pec/types/batch-deposits";
import type { ValidatorDetails } from "pec/types/validator";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

export interface IDepositSelectionValidatorCard {
  distributionMethod: EDistributionMethod;
  depositAmount: number;
  handleSelect: () => void;
  depositIndex: number;
  selected: boolean;
  totalAllocated: number;
  totalToDistribute: number;
  validator: ValidatorDetails;
  errors: FieldErrors<DepositType>;
  register: UseFormRegister<DepositType>;
}

export const DepositSelectionValidatorCard = ({
  distributionMethod,
  depositAmount,
  errors,
  handleSelect,
  depositIndex,
  register,
  selected,
  totalToDistribute,
  validator,
}: IDepositSelectionValidatorCard) => {
  const setValueHandler = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 0;

    if (numValue > totalToDistribute) return totalToDistribute;

    return numValue;
  };

  return (
    <ValidatorCardWrapper
      className={cn({
        "border-indigo-500 dark:border-2 dark:border-indigo-900": selected,
      })}
      onClick={(e) => {
        e.stopPropagation();
        handleSelect();
      }}
    >
      <div
        className="flex flex-[1.2] items-center gap-x-4"
        onClick={handleSelect}
      >
        {selected ? (
          <>
            <CircleCheck className="h-4 min-h-4 w-4 min-w-4 text-green-500 group-hover:hidden" />
            <CircleMinus className="hidden h-4 min-h-4 w-4 min-w-4 text-red-500 group-hover:block" />
          </>
        ) : (
          <CirclePlus className="h-4 min-h-4 w-4 min-w-4 text-indigo-500 group-hover:fill-indigo-500 group-hover:text-white" />
        )}

        <Image
          src="/icons/EthValidator.svg"
          alt="Validator"
          width={24}
          height={24}
        />

        <div className="flex flex-col">
          <div className="text-md">{validator.validatorIndex}</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {validator.publicKey.slice(0, 5)}...{validator.publicKey.slice(-4)}
          </div>
        </div>
      </div>

      <div
        className="flex flex-1 items-center gap-1 p-2"
        onClick={handleSelect}
      >
        <div className="font-semibold">
          Ξ {displayedEthAmount(validator.balance)}
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center p-2">
        <div
          className={`flex w-full items-center ${selected && distributionMethod === EDistributionMethod.MANUAL ? "gap-2" : "gap-1"}`}
        >
          Ξ{" "}
          <Input
            className={`w-full rounded-xl border border-indigo-800 p-1 dark:border-gray-600 ${
              !selected ? "border-none bg-white dark:bg-black" : ""
            }`}
            disabled={
              !selected || distributionMethod === EDistributionMethod.SPLIT
            }
            type="number"
            step="any"
            onClick={(e) => {
              e.stopPropagation();
            }}
            value={depositAmount.toString()}
            // Registers the deposit amount input field with React Hook Form
            // - Converts empty input to 0
            // - Ensures valid numeric input
            // - Blocks deposits that would exceed the total to distribute
            // - Blocks deposits that would take the total allocated above the total to distribute
            // - Returns undefined for invalid values, preventing form submission and showing errors
            {...(depositIndex !== -1 &&
              register(`deposits.${depositIndex}.amount`, {
                setValueAs: setValueHandler,
              }))}
          />
        </div>

        {errors.deposits?.[depositIndex]?.amount && (
          <div className="mt-1 text-xs text-red-500">
            Please enter an acceptable deposit amount.
          </div>
        )}
      </div>
    </ValidatorCardWrapper>
  );
};
