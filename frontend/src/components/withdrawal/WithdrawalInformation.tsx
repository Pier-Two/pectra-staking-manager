"use client";

import type { FC } from "react";
import {
  EWithdrawalStage,
  type IWithdrawalInformation,
} from "pec/types/withdrawal";
import { AlignLeft, Check } from "lucide-react";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { PrimaryButton } from "../ui/custom/PrimaryButton";
import { SecondaryButton } from "../ui/custom/SecondaryButton";
import { PectraSpinner } from "../ui/custom/pectraSpinner";
import { EIconPosition } from "pec/types/components";
import { DECIMAL_PLACES } from "pec/lib/constants";

export const WithdrawalInformation: FC<IWithdrawalInformation> = ({
  buttonText,
  handleMaxAllocation,
  isValid,
  onSubmit,
  resetWithdrawal,
  stage,
  validatorsSelected,
  withdrawalTotal,
}) => {
  const distributionStats = [
    {
      imageUrl: "/icons/EthValidator.svg",
      value: validatorsSelected,
      label: "Validators selected",
    },
    {
      icon: <AlignLeft className="h-4 w-4" />,
      value: withdrawalTotal.toFixed(DECIMAL_PLACES),
      label: "Withdrawal total",
    },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-indigo-400 bg-white p-4 dark:border dark:border-gray-800 dark:bg-black">
      <div className="flex w-full flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-10">
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

        <div>
          {stage === EWithdrawalStage.TRANSACTIONS_CONFIRMED && (
            <div className="flex flex-row items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <div className="text-sm">Done</div>
            </div>
          )}

          {stage === EWithdrawalStage.TRANSACTIONS_SUBMITTED && (
            <div className="flex flex-col items-center gap-2">
              <PrimaryButton
                label="Sign transactions"
                disabled={true}
                icon={<PectraSpinner />}
                iconPosition={EIconPosition.LEFT}
              />
            </div>
          )}

          {stage === EWithdrawalStage.DATA_CAPTURE && (
            <div className="flex flex-row gap-4">
              <SecondaryButton
                label="Max"
                disabled={false}
                onClick={handleMaxAllocation}
              />

              <PrimaryButton
                className="w-40"
                label={buttonText}
                disabled={!isValid}
                onClick={onSubmit}
              />
            </div>
          )}
        </div>
      </div>

      {stage === EWithdrawalStage.TRANSACTIONS_CONFIRMED && (
        <>
          <div className="rounded-xl bg-gray-100 p-2 text-sm text-green-500">
            Your transactions have been submitted successfully and will be
            processed shortly. You can leave this page and check the status of
            your withdrawals in your dashboard.
          </div>

          <PrimaryButton
            label="Make another withdrawal"
            onClick={resetWithdrawal}
            disabled={false}
          />
        </>
      )}
    </div>
  );
};
