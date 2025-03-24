"use client";

import type { FC } from "react";
import Image from "next/image";
import type { IDistributionInformation } from "pec/types/batch-deposits";
import { AlignLeft } from "lucide-react";
import { Separator } from "../ui/separator";
import { PrimaryButton } from "../ui/custom/PrimaryButton";

export const DistributionInformation: FC<IDistributionInformation> = (
  props,
) => {
  const {
    disableButton,
    selectedValidators,
    totalAllocated,
    totalToDistribute,
  } = props;

  return (
    <div className="flex w-full items-center justify-between rounded-xl bg-white p-4 dark:bg-black">
      <div className="flex w-3/4 items-center gap-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <AlignLeft className="h-4 w-4" />
            <div className="text-sm">{totalToDistribute.toFixed(3)}</div>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Total to distribute
          </div>
        </div>

        <Separator
          className="h-12 border-l border-gray-200"
          orientation="vertical"
        />

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Image
              src="/icons/EthValidator.svg"
              alt="Eth Validator"
              width={24}
              height={24}
            />
            <div className="text-sm">{selectedValidators.length}</div>
          </div>

          <div className="text-sm text-gray-700 dark:text-gray-300">
            Selected
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <AlignLeft className="h-4 w-4" />
            <div className="text-sm">{totalAllocated.toFixed(2)}</div>
          </div>

          <div className="text-sm text-gray-700 dark:text-gray-300">
            Allocated
          </div>
        </div>
      </div>

      <div className="w-1/4">
        <PrimaryButton
          className="w-full"
          disabled={disableButton}
          onClick={() => {}}
          label="Next"
        />
      </div>
    </div>
  );
};
