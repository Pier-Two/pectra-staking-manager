"use client";

import { type FC, useState } from "react";
import {
  EDistributionMethod,
  type IDistributionMethod,
} from "pec/types/batch-deposits";
import { CircleDot, Circle, AlignLeft } from "lucide-react";
import { Input } from "../ui/input";
import { DistributionInformation } from "./DistributionInformation";

export const DistributionMethod: FC<IDistributionMethod> = (props) => {
  const {
    changeDistributionMethod,
    distributionMethod,
    setDistributionMethod,
    setTotalToDistribute,
    walletBalance,
    disableButton,
    selectedValidators,
    totalAllocated,
    totalToDistribute,
  } = props;

  const [totalAmount, setTotalAmount] = useState<number>(0);

  const handleDistributionMethodClick = (method: EDistributionMethod) => {
    if (distributionMethod === method) return;
    changeDistributionMethod();
    setTotalAmount(0);
    setDistributionMethod(method);
  };

  const handleTotalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputStr = e.target.value;
    const value = parseFloat(inputStr);

    if (isNaN(value) || value < 0) {
      setTotalAmount(0);
      setTotalToDistribute(0);
      return;
    }

    setTotalAmount(value);
    setTotalToDistribute(value);
    e.target.value = value.toString();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="text-lg">Distribution Method</div>
        <div className="flex flex-row justify-between gap-8">
          <div
            className={`flex w-full flex-row gap-4 rounded-xl bg-white p-4 dark:bg-black ${distributionMethod === EDistributionMethod.SPLIT ? "border border-indigo-500 dark:border-indigo-500" : "cursor-pointer"}`}
            onClick={() =>
              handleDistributionMethodClick(EDistributionMethod.SPLIT)
            }
          >
            {distributionMethod === EDistributionMethod.SPLIT && (
              <CircleDot className="h-10 w-10 fill-indigo-500 text-white" />
            )}

            {distributionMethod === EDistributionMethod.MANUAL && (
              <Circle className="h-10 w-10 text-indigo-500" />
            )}

            <div className="flex flex-col gap-2 p-1">
              <div className="text-md font-bold">Split evenly</div>

              <div className="text-sm text-gray-700 dark:text-gray-300">
                Enter a single total amount and have it deposited evenly across
                selected validators
              </div>
            </div>
          </div>

          <div
            className={`flex w-full flex-row gap-4 rounded-xl bg-white p-4 dark:bg-black ${distributionMethod === EDistributionMethod.MANUAL ? "border border-indigo-500 dark:border-indigo-500" : "cursor-pointer"}`}
            onClick={() =>
              handleDistributionMethodClick(EDistributionMethod.MANUAL)
            }
          >
            {distributionMethod === EDistributionMethod.SPLIT && (
              <Circle className="h-10 w-10 text-indigo-500" />
            )}
            {distributionMethod === EDistributionMethod.MANUAL && (
              <CircleDot className="h-10 w-10 fill-indigo-500 text-white" />
            )}
            <div className="flex flex-col gap-2 p-1">
              <div className="text-md font-bold">Manual entry</div>

              <div className="text-sm text-gray-700 dark:text-gray-300">
                Enter individual deposit amount for each selected validator and
                submit one transaction for total.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-lg">Total Amount</div>
        <div className="space-y-1">
          <div className="flex w-full items-center rounded-xl bg-white p-4 text-black dark:bg-black dark:text-white">
            <AlignLeft className="h-4 w-4" />
            <Input
              className="w-full border-none"
              placeholder="Enter total amount"
              value={totalAmount}
              type="number"
              onChange={handleTotalAmountChange}
            />
          </div>

          <div className="flex flex-row items-center gap-1">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Available balance:
            </div>

            <div className="flex items-center gap-1 p-2">
              <AlignLeft className="h-4 w-4" />
              <div className="text-sm">{walletBalance.toFixed(3)}</div>
            </div>
          </div>

          {totalToDistribute === 0 && (
            <div className="text-sm text-red-700 dark:text-red-300">
              Please select an amount to distribute.
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <DistributionInformation
          disableButton={disableButton}
          selectedValidators={selectedValidators}
          totalAllocated={totalAllocated}
          totalToDistribute={totalToDistribute}
        />

        {distributionMethod === EDistributionMethod.MANUAL && (
          <div className="flex flex-row items-center gap-1">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Available balance:
            </div>

            <div className="flex items-center gap-1 p-2">
              <AlignLeft className="h-4 w-4" />
              <div className="text-sm">{walletBalance.toFixed(3)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
