import type { FieldErrors, UseFormRegister } from "react-hook-form";
import Image from "next/image";
import { CirclePlus } from "lucide-react";
import { FaCircleCheck, FaCircleMinus, FaCirclePlus } from "react-icons/fa6";

import type { DepositType } from "pec/lib/api/schemas/deposit";
import type { ValidatorDetails } from "pec/types/validator";
import { ValidatorCardWrapper } from "pec/components/ui/custom/validator-card-wrapper";
import { Input } from "pec/components/ui/input";
import { MAX_VALIDATOR_BALANCE } from "pec/constants/deposit";
import { DECIMAL_PLACES } from "pec/lib/constants";
import { cn } from "pec/lib/utils";
import { displayedEthAmount } from "pec/lib/utils/validators/balance";
import { EDistributionMethod } from "pec/types/batch-deposits";

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

    // only enforce max in SPLIT mode
    if (
      distributionMethod === EDistributionMethod.SPLIT &&
      numValue > totalToDistribute
    )
      return totalToDistribute;

    return numValue;
  };

  return (
    <ValidatorCardWrapper
      isSelected={selected}
      onClick={(e) => {
        e.stopPropagation();
        handleSelect();
      }}
    >
      <div className="flex flex-[1.2] items-center gap-x-4 transition-colors duration-200">
        {selected ? (
          <>
            <FaCircleCheck className="h-5 min-h-5 w-5 min-w-5 text-green-500 group-hover:hidden" />
            <FaCircleMinus className="hidden h-5 min-h-5 w-5 min-w-5 text-red-500 group-hover:block" />
          </>
        ) : (
          <>
            <CirclePlus className="h-5 min-h-5 w-5 min-w-5 text-primary group-hover:hidden" />
            <FaCirclePlus className="hidden h-5 min-h-5 w-5 min-w-5 text-primary group-hover:block" />
          </>
        )}

        <Image
          src="/icons/EthValidator.svg"
          alt="Validator"
          width={24}
          height={24}
        />

        <div className="flex flex-col">
          <div className="text-sm font-570">{validator.validatorIndex}</div>
          <div className="text-sm text-piertwo-text">
            {validator.publicKey.slice(0, 5)}...{validator.publicKey.slice(-4)}
          </div>
        </div>
      </div>

      <div className="flex-1 flex-col items-center">
        <div className="flex flex-1 items-center font-inter">
          Ξ {displayedEthAmount(validator.balance)}
        </div>
        <div className="flex flex-1 items-center font-inter text-xs text-piertwo-text">
          Ξ
          {(
            MAX_VALIDATOR_BALANCE -
            Number(displayedEthAmount(validator.balance))
          ).toFixed(DECIMAL_PLACES)}{" "}
          remaining
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center p-2">
        <div
          className={cn("flex w-full items-center", {
            "gap-2":
              selected && distributionMethod === EDistributionMethod.MANUAL,
            "gap-1": !(
              selected && distributionMethod === EDistributionMethod.MANUAL
            ),
          })}
        >
          <div className="relative w-full">
            <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-sm text-piertwo-text">
              Ξ
            </div>
            <Input
              className={cn(
                "font-400 h-12 w-full rounded-md border border-border p-1 pl-6 font-inter dark:border-gray-600",
                !selected && "border-none bg-white dark:bg-black",
              )}
              disabled={
                !selected || distributionMethod === EDistributionMethod.SPLIT
              }
              onClick={(e) => e.stopPropagation()}
              type="number"
              step="any"
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
