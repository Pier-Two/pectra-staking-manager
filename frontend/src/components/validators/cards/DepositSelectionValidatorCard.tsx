"use client";

import { type FC,  } from "react";
import Image from "next/image";
import { AlignLeft, CircleCheck, CirclePlus } from "lucide-react";
import { Input } from "pec/components/ui/input";
import {
  EDistributionMethod,
  type IDepositSelectionValidatorCard,
} from "pec/types/batch-deposits";

export const DepositSelectionValidatorCard: FC<
  IDepositSelectionValidatorCard
> = (props) => {
  const {
    depositAmount,
    distributionMethod,
    selected,
    amount,
    setAmount,
    totalAllocated,
    totalToDistribute,
    validator,
    onClick,
    onDepositChange,
  } = props;

  const handleDeselect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selected) {
      onClick(validator, 0);
      setAmount(0);
    }
  };

  const handleDepositAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseFloat(e.target.value);

    const isValidAmount =
      !isNaN(value) &&
      value >= 0 &&
      value <= totalToDistribute &&
      value + totalAllocated <= totalToDistribute;

    const depositAmount = isValidAmount ? value : 0;

    setAmount(depositAmount);
    onDepositChange({
      validator,
      depositAmount,
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setAmount(0);
      return;
    }

    const value = parseFloat(e.target.value);
    if (isNaN(value) || value < 0) return;
    setAmount(value);
  };

  return (
    <div
      className={`flex-col-3 flex w-full items-center justify-between gap-x-4 rounded-xl border bg-white p-4 hover:border-indigo-500 dark:border-gray-800 dark:bg-black dark:hover:border-gray-600 ${
        selected ? "border-indigo-500 dark:border-gray-600" : "cursor-pointer"
      } group`}
      onClick={() => !selected && onClick(validator, amount)}
    >
      <div className="flex items-center gap-x-4">
        {selected ? (
          <CircleCheck
            className="h-4 w-4 fill-green-500 text-white hover:cursor-pointer dark:text-black"
            onClick={handleDeselect}
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
          <div className="text-md">{validator.validatorIndex}</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {validator.publicKey.slice(0, 5)}...{validator.publicKey.slice(-4)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 p-2">
        <AlignLeft className="h-4 w-4" />
        <div className="text-sm">{validator.balance.toFixed(3)}</div>
      </div>

      <div
        className={`flex items-center p-2 ${selected && distributionMethod === EDistributionMethod.MANUAL ? "gap-2" : "gap-1"}`}
      >
        <AlignLeft className="h-4 w-4" />

        {(distributionMethod === EDistributionMethod.SPLIT ||
          (distributionMethod === EDistributionMethod.MANUAL && !selected)) && (
          <div className="text-sm">{depositAmount.toFixed(3)}</div>
        )}

        {selected && distributionMethod === EDistributionMethod.MANUAL && (
          <Input
            className="w-full rounded-xl border border-indigo-800 dark:border-gray-600"
            placeholder="Enter deposit amount"
            value={amount || ""}
            type="number"
            onChange={handleAmountChange}
            onBlur={handleDepositAmountChange}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
    </div>
  );
};
