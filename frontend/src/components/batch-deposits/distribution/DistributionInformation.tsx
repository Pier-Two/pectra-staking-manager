import { Check, ExternalLink } from "lucide-react";
import Image from "next/image";
import { SecondaryButton } from "pec/components/ui/custom/SecondaryButton";
import { type DepositWorkflowStage } from "pec/types/batch-deposits";
import { EIconPosition } from "pec/types/components";
import { PrimaryButton } from "../../ui/custom/PrimaryButton";
import { Separator } from "../../ui/separator";
import { displayedEthAmount } from "pec/lib/utils/validators/balance";
import { useActiveChainWithDefault } from "pec/hooks/useChain";
import {
  getBlockExplorerTxUrl,
  openInNewTab,
} from "pec/helpers/getExternalLink";

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
  const chain = useActiveChainWithDefault();

  const distributionStats = [
    {
      icon: "Ξ",
      value: displayedEthAmount(totalToDistribute),
      label: "Total to distribute",
    },
    {
      imageUrl: "/icons/EthValidator.svg",
      value: numDeposits,
      label: "Selected",
    },
    {
      icon: "Ξ",
      value: totalAllocated,
      label: "Allocated",
    },
  ];

  const handleMakeAnotherDeposit = () => {
    resetBatchDeposit();
  };

  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-border bg-white p-4 shadow-md dark:border dark:border-gray-800 dark:bg-black">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div className="flex flex-row items-center">
          {distributionStats.map((stat, index) => (
            <div key={stat.label} className="mr-6 flex items-center">
              {index === 1 && (
                <Separator
                  className="mr-6 h-12 bg-gray-200 dark:bg-gray-800"
                  orientation="vertical"
                />
              )}

              <div className="flex flex-col gap-1">
                <div className="flex min-h-7 items-center gap-2 font-semibold">
                  {stat.icon}
                  {stat.imageUrl && (
                    <Image
                      src={stat.imageUrl}
                      alt="Icon"
                      width={16}
                      height={16}
                    />
                  )}
                  <div className="text-sm">{stat.value}</div>
                </div>

                <div className="font-inter text-xs text-[#52525B] dark:text-gray-500">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end md:min-w-52">
          {stage.type === "sign-submit" &&
            stage.transactionStatus.status === "finalised" && (
              <div className="mr-4 flex flex-row items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <div className="text-sm font-570">Done</div>
              </div>
            )}
          {stage.type === "data-capture" && (
            <PrimaryButton
              className="w-full"
              onClick={onSubmit}
              label={"Next"}
              disabled={submitButtonDisabled}
            />
          )}
        </div>
      </div>

      {stage.type === "sign-submit" &&
        (stage.transactionStatus.status === "submitted" ||
          stage.transactionStatus.status === "finalised") && (
          <>
            <div className="rounded-md bg-green-500/[7%] p-2 text-[13px] font-570 text-green-500">
              Your transactions{" "}
              {stage.transactionStatus.status === "submitted"
                ? "have been submitted successfully and will be processed shortly. It is safe to leave this page."
                : "have been processed successfully."}
            </div>

            <SecondaryButton
              label="View transaction"
              icon={<ExternalLink className="h-4 w-4" />}
              className="border-none"
              iconPosition={EIconPosition.RIGHT}
              disabled={false}
              onClick={() => {
                // I hate to cast here, but this is type-narrowed properly with the above check, but for some reason typescript is confused
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
                const txHash = (stage.transactionStatus as any).txHash;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                openInNewTab(getBlockExplorerTxUrl(txHash, chain.id));
              }}
            />
          </>
        )}
      {stage.type === "sign-submit" &&
        stage.transactionStatus.status !== "pending" &&
        stage.transactionStatus.status !== "signing" && (
          <PrimaryButton
            label="Make another deposit"
            onClick={handleMakeAnotherDeposit}
            disabled={false}
          />
        )}
    </div>
  );
};
