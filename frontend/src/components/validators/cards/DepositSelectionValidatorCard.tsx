"use client";

import { useState, type FC } from "react";
import Image from "next/image";
import type { IBatchDepositValidatorCard } from "pec/types/validator";
import { AlignLeft, CircleCheck, CirclePlus } from "lucide-react";
import { EDistributionMethod } from "pec/types/batch-deposits";
import { Input } from "pec/components/ui/input";

export const DepositSelectionValidatorCard: FC<IBatchDepositValidatorCard> = (
  props,
) => {
  const {
    depositAmount,
    distributionMethod,
    selected,
    totalAllocated,
    totalToDistribute,
    validator,
    onClick,
  } = props;

  const { balance } = validator;

  const [amount, setAmount] = useState<number>(0);

  const handleDeselectValidator = () => {
    if (selected) {
      onClick(validator, distributionMethod, depositAmount);
      setAmount(0);
    }
  };

  const handleDepositAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const inputStr = e.target.value;
    const value = parseFloat(inputStr);

    if (
      isNaN(value) ||
      value < 0 ||
      value > totalToDistribute ||
      totalAllocated + value > totalToDistribute
    ) {
      setAmount(0);
      return;
    }

    setAmount(value);
    e.target.value = value.toString();
  };

  return (
    <div
      className={`flex-col-3 flex w-full items-center justify-between gap-x-4 rounded-xl border bg-white p-4 hover:border-indigo-500 dark:border-gray-800 dark:bg-black dark:hover:border-gray-600 ${selected ? "border-indigo-500 dark:border-indigo-500" : "cursor-pointer"} group`}
      onClick={() =>
        !selected && onClick(validator, distributionMethod, depositAmount)
      }
    >
      <div className="flex items-center gap-x-4">
        {selected ? (
          <CircleCheck
            className={`h-4 w-4 fill-green-500 text-white dark:text-black ${selected ? "hover:cursor-pointer" : ""}`}
            onClick={handleDeselectValidator}
          />
        ) : (
          <CirclePlus className="h-4 w-4 text-indigo-500 group-hover:fill-indigo-500 group-hover:text-white" />
        )}

        <Image
          src="/icons/EthValidator.svg"
          alt="Wallet"
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

      <div className="flex items-center gap-1 p-2">
        <AlignLeft className="h-4 w-4" />
        <div className="text-sm">{balance.toFixed(3)}</div>
      </div>

      <div className="flex items-center gap-1 p-2">
        <AlignLeft className="h-4 w-4" />

        {(distributionMethod === EDistributionMethod.SPLIT ||
          (distributionMethod === EDistributionMethod.MANUAL && !selected)) && (
          <div className="text-sm">{depositAmount.toFixed(3)}</div>
        )}

        {selected && distributionMethod === EDistributionMethod.MANUAL && (
          <Input
            className="w-full border-none"
            placeholder="Enter deposit amount"
            value={amount}
            type="number"
            onChange={handleDepositAmountChange}
            onBlur={() => onClick(validator, distributionMethod, amount)}
          />
        )}
      </div>
    </div>
  );
};
