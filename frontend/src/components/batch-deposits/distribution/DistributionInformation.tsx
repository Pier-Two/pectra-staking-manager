import { AlignLeft, Check, ExternalLink } from "lucide-react";
import Image from "next/image";
import { SecondaryButton } from "pec/components/ui/custom/SecondaryButton";
import { DECIMAL_PLACES } from "pec/lib/constants";
import { type DepositWorkflowStage } from "pec/types/batch-deposits";
import { EIconPosition } from "pec/types/components";
import { PrimaryButton } from "../../ui/custom/PrimaryButton";
import { Separator } from "../../ui/separator";

export interface IDistributionInformation {
  onSubmit?: () => void;
  resetBatchDeposit: () => void;
  submitButtonDisabled?: boolean;
  numDeposits: number;
  stage: DepositWorkflowStage;
  totalAllocated: number;
  totalToDistribute: number;
}

export const DistributionInformation = ({
  onSubmit,
  resetBatchDeposit,
  submitButtonDisabled,
  numDeposits,
  stage,
  totalAllocated,
  totalToDistribute,
}: IDistributionInformation) => {
  const distributionStats = [
    {
      icon: <AlignLeft className="h-4 w-4" />,
      value: totalToDistribute?.toFixed(DECIMAL_PLACES) ?? 0,
      label: "Total to distribute",
    },
    {
      imageUrl: "/icons/EthValidator.svg",
      value: numDeposits,
      label: "Selected",
    },
    {
      icon: <AlignLeft className="h-4 w-4" />,
      value: totalAllocated,
      label: "Allocated",
    },
  ];

  const handleMakeAnotherDeposit = () => {
    resetBatchDeposit();
  };

  return (
    <div className="flex flex-col w-full gap-4 rounded-xl border border-indigo-400 bg-white p-4 dark:border dark:border-gray-800 dark:bg-black">
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:gap-10">
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

        <div className="flex w-full flex-shrink-0 lg:w-auto">
          {stage.type === "transactions-finalised" && (
            <div className="flex flex-row items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <div className="text-sm">Done</div>
            </div>
          )}
          {stage.type === "data-capture" && (
            <PrimaryButton
              className="w-full lg:w-auto"
              onClick={onSubmit}
              label={"Deposit"}
              disabled={submitButtonDisabled}
            />
          )}
        </div>
      </div>

      {(stage.type === "transactions-submitted" ||
        stage.type === "transactions-finalised") && (
        <>
          <div className="rounded-xl bg-gray-100 p-2 text-sm text-green-500">
            Your transactions{" "}
            {stage.type === "transactions-submitted"
              ? "have been submitted successfully and will be processed shortly. It is safe to leave this page."
              : "have been processed successfully."}
          </div>

          <SecondaryButton
            label="View transaction"
            icon={<ExternalLink className="h-4 w-4" />}
            iconPosition={EIconPosition.RIGHT}
            disabled={false}
            onClick={() => {
              window.open(`https://etherscan.io/tx/${stage.txHash}`, "_blank");
            }}
          />
        </>
      )}
      {stage.type !== "data-capture" && stage.type !== "sign-data" && (
        <PrimaryButton
          label="Make another deposit"
          onClick={handleMakeAnotherDeposit}
          disabled={false}
        />
      )}
    </div>
  );
};
