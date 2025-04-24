"use client";

import clsx from "clsx";
import { ChevronsLeftRight } from "lucide-react";
import Image from "next/image";
import { type IDetectedValidators } from "pec/types/validator";
import { useState, type FC } from "react";
import { ValidatorCard } from "./cards/ValidatorCard";
import { validatorIsActive } from "pec/lib/utils/validators/status";
import { displayedEthAmount } from "pec/lib/utils/validators/balance";

export const DetectedValidators: FC<IDetectedValidators> = (props) => {
  const { cardTitle, validators } = props;

  const activeValidators = validators?.filter((validator) =>
    validatorIsActive(validator),
  );

  const numberOfInactiveValidators =
    validators?.length - activeValidators?.length;

  const [showValidators, setShowValidators] = useState<boolean>(false);

  const totalBalance = validators.reduce(
    (acc, validator) => acc + validator.balance,
    0n,
  );

  return (
    <div className="flex flex-col gap-y-3">
      <div
        onClick={() => setShowValidators(!showValidators)}
        className={clsx(
          "flex-col-2 flex w-full items-center justify-between gap-x-4 rounded-2xl border border-indigo-300 bg-white px-4 py-6 transition-colors hover:cursor-pointer dark:border-gray-800 dark:bg-black",
          showValidators && "outline outline-[1px] outline-primary",
        )}
      >
        <div className="flex items-center gap-x-4">
          <Image
            src="/icons/EthValidator.svg"
            alt="Wallet"
            width={24}
            height={24}
          />
          <p className="text-[14px] font-570 leading-[14px] text-zinc-950 dark:text-zinc-50">
            {validators.length} {cardTitle}{" "}
            {numberOfInactiveValidators > 0 &&
              `(${numberOfInactiveValidators} inactive or exiting)`}
          </p>
        </div>

        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-1">
            <p className="text-[14px] font-570 leading-[14px] text-zinc-950 dark:text-zinc-50">
              Ξ {displayedEthAmount(totalBalance)}
            </p>
          </div>
          <ChevronsLeftRight className="h-4 w-4 rotate-90 text-gray-800 dark:text-white" />
        </div>
      </div>

      {showValidators && (
        <div className="flex w-full flex-col items-center gap-y-2">
          {activeValidators.map((validator, index) => (
            <ValidatorCard
              key={index + validator.validatorIndex}
              shrink={true}
              validator={validator}
              className="!bg-transparent"
            />
          ))}
        </div>
      )}
    </div>
  );
};
