"use client";

import { type FC } from "react";
import Image from "next/image";
import { AlignLeft } from "lucide-react";
import { Separator } from "../../ui/separator";
import { PrimaryButton } from "../../ui/custom/PrimaryButton";
import {
  EBatchDepositStage,
  type IDistributionInformation,
} from "pec/types/batch-deposits";

export const DistributionInformation: FC<IDistributionInformation> = (
  props,
) => {
  const {
    disableButton,
    setStage,
    selectedValidators,
    totalAllocated,
    totalToDistribute,
  } = props;

  const distributionStats = [
    {
      icon: <AlignLeft className="h-4 w-4" />,
      value: totalToDistribute.toFixed(3),
      label: "Total to distribute",
    },
    {
      imageUrl: "/icons/EthValidator.svg",
      value: selectedValidators.length,
      label: "Selected",
    },
    {
      icon: <AlignLeft className="h-4 w-4" />,
      value: totalAllocated.toFixed(2),
      label: "Allocated",
    },
  ];

  return (
    <div className="flex w-full items-center justify-between rounded-xl border border-indigo-400 bg-white p-4 dark:border dark:border-gray-800 dark:bg-black">
      <div className="flex w-3/4 items-center gap-10">
        {distributionStats.map((stat, index) => (
          <div key={stat.label} className="flex items-center">
            {index > 0 && (
              <Separator
                className="mx-5 h-12 border-l border-gray-200"
                orientation="vertical"
              />
            )}

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                {stat.icon}
                {stat.imageUrl && (
                  <Image
                    src={stat.imageUrl}
                    alt="Icon"
                    width={24}
                    height={24}
                  />
                )}
                <div className="text-sm">{stat.value}</div>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-500">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-1/4">
        <PrimaryButton
          className="w-full"
          disabled={disableButton}
          onClick={() => setStage(EBatchDepositStage.SIGN_DATA)}
          label="Next"
        />
      </div>
    </div>
  );
};
