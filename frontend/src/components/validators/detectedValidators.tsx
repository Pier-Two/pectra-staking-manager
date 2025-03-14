"use client";

import { type FC, useState } from "react";
import Image from "next/image";
import type { IDetectedValidators } from "pec/types/validator";
import { AlignLeft, ChevronsLeftRight } from "lucide-react";
import { ValidatorCard } from "./validatorCard";

export const DetectedValidators: FC<IDetectedValidators> = (props) => {
  const { validators } = props;

  const [showValidators, setShowValidators] = useState<boolean>(false);

  const totalBalance = validators.reduce(
    (acc, validator) => acc + validator.balance,
    0,
  );

  return (
    <>
      <div
        onClick={() => setShowValidators(!showValidators)}
        className="flex-col-2 flex min-h-[10vh] w-full items-center justify-between gap-x-4 rounded-xl border border-gray-200 bg-white p-4 hover:cursor-pointer hover:bg-gray-100 dark:border-gray-800 dark:bg-black dark:hover:bg-gray-800"
      >
        <div className="flex items-center gap-x-4">
          <Image
            src="/icons/EthValidator.svg"
            alt="Wallet"
            width={24}
            height={24}
          />
          <div className="text-md">{validators.length} validators found</div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <AlignLeft className="h-3 w-3 text-gray-500" />
            <span> {totalBalance.toFixed(2)}</span>
          </div>
          <ChevronsLeftRight className="h-5 w-5 rotate-90 text-gray-800 dark:text-white" />
        </div>
      </div>

      {showValidators && (
        <div className="flex flex-col w-full items-center gap-4">
          {validators.map((validator, index) => (
            <ValidatorCard
              key={index + validator.validatorIndex}
              validator={validator}
            />
          ))}
        </div>
      )}
    </>
  );
};
