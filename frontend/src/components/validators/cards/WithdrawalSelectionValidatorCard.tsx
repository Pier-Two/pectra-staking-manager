"use client";

import type { FC } from "react";
import Image from "next/image";
import type { IWithdrawalSelectionValidatorCard } from "pec/types/withdrawal";
import { CircleCheck, CirclePlus, AlignLeft } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { WithdrawalType } from "pec/lib/api/schemas/withdrawal";
import { DECIMAL_PLACES } from "pec/lib/constants";

interface ExtendedProps extends IWithdrawalSelectionValidatorCard {
  errors: FieldErrors<WithdrawalType>;
  register: UseFormRegister<WithdrawalType>;
}

export const WithdrawalSelectionValidatorCard: FC<ExtendedProps> = ({
  availableAmount,
  errors,
  handleSelect,
  index,
  register,
  selected,
  validator,
}) => {
  const { validatorIndex, publicKey, balance } = validator;
  const locked = availableAmount === 0;

  return (
    <div
      className={`flex-col-3 flex w-full items-center justify-between gap-x-4 rounded-xl border bg-white p-4 ${locked ? "opacity-50" : "hover:border-indigo-500 dark:hover:border-gray-600 group"} dark:border-gray-800 dark:bg-black ${
        selected ? "border-indigo-500 dark:border-gray-600" : ""
      } ${locked || selected ? "" : "cursor-pointer"}`}
      onClick={selected || locked ? undefined : handleSelect}
    >
      <div className="flex items-center gap-x-4">
        {selected ? (
          <CircleCheck
            className="h-4 w-4 fill-green-500 text-white hover:cursor-pointer dark:text-black"
            onClick={handleSelect}
          />
        ) : (
          <CirclePlus className="h-4 w-4 text-indigo-500 group-hover:fill-indigo-500 group-hover:text-white" />
        )}

        <Image
          src="/icons/EthValidator.svg"
          alt="Validator"
          width={24}
          height={24}
        />

        <div className="flex flex-col">
          <div className="text-md">{validatorIndex}</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {publicKey.slice(0, 5)}...{publicKey.slice(-4)}
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1 p-2">
          <AlignLeft className="h-4 w-4" />
          <div className="text-sm">{balance.toFixed(DECIMAL_PLACES)}</div>
        </div>

        <div className="flex items-center gap-1 p-2 text-gray-700 dark:text-gray-300">
          <AlignLeft className="h-3 w-3" />
          <div className="text-sm">
            {availableAmount.toFixed(DECIMAL_PLACES)} available
          </div>
        </div>
      </div>

      {selected ? (
        <div className="flex max-w-[25%] p-2">
          <div className="flex flex-col">
            <div className="flex flex-row items-center gap-2">
              <AlignLeft className="h-4 w-4" />

              <input
                className={`w-full rounded-xl border border-indigo-300 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-black dark:text-gray-300 ${locked ? "opacity-50" : ""}`}
                disabled={locked}
                type="number"
                step="any"
                {...register(`withdrawals.${index}.amount`, {
                  setValueAs: (value) => {
                    if (value === "") return 0;
                    if (locked) return 0;
                    const numValue = parseFloat(value as string);
                    if (isNaN(numValue)) return 0;
                    if (numValue === 0) return 0;
                    if (balance - numValue < 32) return undefined;
                    if (numValue > availableAmount) return undefined;
                    return numValue;
                  },
                })}
              />
            </div>

            {errors.withdrawals?.[index]?.amount && (
              <div className="mt-1 text-sm text-red-500">
                Please enter an amount less than or equal to your available
                balance.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex max-w-[25%] items-center gap-1 p-2">
          <AlignLeft className="h-4 w-4" />
          <input
            className="w-full rounded-xl border-none bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-black dark:text-gray-300"
            disabled
            type="number"
            value={0}
          />
        </div>
      )}
    </div>
  );
};
