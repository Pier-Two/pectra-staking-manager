import { AlignLeft, CircleCheck, CircleMinus, CirclePlus } from "lucide-react";
import Image from "next/image";
import { Input } from "pec/components/ui/input";
import type { WithdrawalFormType } from "pec/lib/api/schemas/withdrawal";
import { cn } from "pec/lib/utils";
import { parseEtherToFixedDecimals } from "pec/lib/utils/parseAmounts";
import type { ValidatorDetails } from "pec/types/validator";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { formatEther } from "viem";

interface ExtendedProps {
  availableAmount: bigint;
  handleSelect: () => void;
  withdrawalIndex: number;
  selected: boolean;
  validator: ValidatorDetails;
  errors: FieldErrors<WithdrawalFormType>;
  register: UseFormRegister<WithdrawalFormType>;
}

export const WithdrawalSelectionValidatorCard = ({
  errors,
  handleSelect,
  register,
  withdrawalIndex,
  selected,
  validator,
}: ExtendedProps) => {
  const { validatorIndex, publicKey, balance } = validator;
  const locked = validator.balance === 0n;

  const onClickHandler = () => {
    if (locked) return;

    handleSelect();
  };

  const setValueHandler = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 0;

    if (numValue > Number(formatEther(validator.balance)))
      return Number(formatEther(validator.balance));

    return numValue;
  };

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-x-4 rounded-xl border bg-white px-4 py-3",
        "dark:border-gray-800 dark:bg-black",
        {
          "opacity-50": locked,
          "group hover:border-indigo-500 dark:hover:border-gray-600": !locked,
          "border-indigo-500 dark:border-2 dark:border-indigo-900": selected,
          "cursor-pointer": !locked,
        },
      )}
    >
      <div className="flex flex-[1.2] items-center gap-x-4" onClick={onClickHandler}>
        {selected && !locked ? (
          <>
            <CircleCheck className="min-h-4 min-w-4 w-4 h-4 text-green-500 group-hover:hidden" />
            <CircleMinus className="hidden min-h-4 w-4 h-4 min-w-4 text-red-500 group-hover:block" />
          </>
        ) : (
          <CirclePlus
            className="min-h-4 min-w-4 w-4 h-4 text-indigo-500 group-hover:fill-indigo-500 group-hover:text-white"
          />
        )}

        <Image
          src="/icons/EthValidator.svg"
          alt="Validator"
          width={24}
          height={24}
        />

        <div className="flex flex-col">
          <div className="text-sm">{validatorIndex}</div>
          <div className="text-xs text-gray-700 dark:text-gray-300">
            {publicKey.slice(0, 5)}...{publicKey.slice(-4)}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col" onClick={onClickHandler}>
        <div className="flex items-center gap-1">
          <AlignLeft className="h-4 w-4" />
          <div className="text-sm">{parseEtherToFixedDecimals(balance)}</div>
        </div>

        <div className="flex items-center gap-1 py-1 text-gray-700 dark:text-gray-300">
          <AlignLeft className="h-3 w-3" />
          <div className="text-sm">
            {parseEtherToFixedDecimals(validator.balance)} available
          </div>
        </div>
      </div>

      <div className="flex-1">
        {selected ? (
          <div className="flex">
            <div className="flex w-full flex-col">
              <div className="flex flex-row items-center gap-2">
                <AlignLeft className="h-4 w-4" />

                <Input
                  className={`w-full rounded-xl border border-indigo-300 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-black dark:text-gray-300 ${locked ? "opacity-50" : ""}`}
                  disabled={locked}
                  type="number"
                  step="any"
                  {...register(`withdrawals.${withdrawalIndex}.amount`, {
                    // valueAsNumber: true,
                    // required: true,
                    // min: 0,
                    setValueAs: setValueHandler,
                  })}
                />
              </div>

              {errors.withdrawals?.[withdrawalIndex]?.amount && (
                <div className="mt-1 text-xs text-red-500">
                  Please enter an amount less than or equal to your available
                  balance.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <AlignLeft className="h-4 w-4" />
            <Input
              className="w-full rounded-xl border-none bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-black dark:text-gray-300"
              disabled
              type="number"
              value={0}
            />
          </div>
        )}
      </div>
    </div>
  );
};
