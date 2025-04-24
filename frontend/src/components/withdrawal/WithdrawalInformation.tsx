import { AlignLeft, Check } from "lucide-react";
import Image from "next/image";
import { DECIMAL_PLACES } from "pec/lib/constants";
import type { WithdrawWorkflowStages } from "pec/types/withdraw";
import { PectraSpinner } from "../ui/custom/pectraSpinner";
import { PrimaryButton } from "../ui/custom/PrimaryButton";
import { SecondaryButton } from "../ui/custom/SecondaryButton";
import { Separator } from "../ui/separator";

export interface IWithdrawalInformation {
  buttonText: string;
  disabled: boolean;
  handleMaxAllocation: () => void;
  onSubmit: () => void;
  resetWithdrawal: () => void;
  stage: WithdrawWorkflowStages;
  validatorsSelected: number;
  withdrawalTotal: number;
}

export const WithdrawalInformation = ({
  buttonText,
  handleMaxAllocation,
  disabled,
  onSubmit,
  resetWithdrawal,
  stage,
  validatorsSelected,
  withdrawalTotal,
}: IWithdrawalInformation) => {
  const distributionStats = [
    {
      imageUrl: "/icons/EthValidator.svg",
      value: validatorsSelected,
      label: "Validators selected",
    },
    {
      icon: <AlignLeft className="h-4 w-4 text-670" />,
      value: withdrawalTotal.toFixed(DECIMAL_PLACES),
      label: "Withdrawal total",
    },
  ];
  
  const someTransactionsFailed =
  stage.type === "sign-submit-finalise" &&
  Object.values(stage.txHashes).some((tx) => tx.status === "failed" || tx.status === "failedToSubmit");

  const isSigning =
  stage.type === "sign-submit-finalise" &&
  Object.values(stage.txHashes).some((tx) => tx.status === "signing");

  const isSubmitting =
  stage.type === "sign-submit-finalise" &&
  !isSigning &&
  Object.values(stage.txHashes).every(
    (tx) => tx.status === "submitted" || tx.status === "finalised",
  );

  const allTransactionsFinalised =
    stage.type === "sign-submit-finalise" &&
    Object.values(stage.txHashes).every((tx) => tx.status === "finalised" || tx.status === "failed");

  return (
    <div className="flex flex-col justify-center w-full gap-4 rounded-2xl min-h-[90px] border bg-white pl-6 dark:border dark:border-gray-800 dark:bg-black">
      <div className="flex flex-col md:flex-row w-full items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {distributionStats.map((stat, index) => (
            <div key={stat.label} className="flex items-center">
              {index > 0 && (
                <Separator
                  className="mx-5 h-12 bg-gray-200 dark:bg-gray-800"
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
                      width={16}
                      height={16}
                      className=""
                    />
                  )}
                  <div className="text-sm font-inter font-670">{stat.value}</div>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-500 font-inter font-380">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6">
          {(isSigning || isSubmitting) && !allTransactionsFinalised && (
            <div className="flex flex-row items-center gap-2">
              <PectraSpinner />
            </div>
          )}
            


          {allTransactionsFinalised && (
            <>
            <div className="flex flex-row items-center gap-2">
              {!someTransactionsFailed && (
                <Check className="h-4 w-4 text-green-500" />  
              )}
              <div className="text-sm">Done</div>
              
            </div>
            
          </>
          )}

          {stage.type === "data-capture" && (
            <div className="flex flex-row gap-4">
              <SecondaryButton
                className="border-gray-200 dark:border-gray-800"
                label="Max"
                disabled={false}
                onClick={handleMaxAllocation}
              />

              <PrimaryButton
                className="w-60"
                label={buttonText}
                disabled={!disabled}
                onClick={onSubmit}
              />
            </div>
          )}
        </div>
      </div>

      {someTransactionsFailed && (
          <>
            <div className="rounded-xl bg-gray-100 p-2 text-sm text-gray-500 dark:bg-black">
              Some transactions failed. Please check your validator statuses and try again.
            </div>

            <PrimaryButton
              label="Make another withdrawal"
              onClick={resetWithdrawal}
              disabled={false}
            />
          </>
      )}

      {isSubmitting && (
        <>
          <div className="rounded-xl bg-gray-100 p-2 text-sm text-gray-500 dark:bg-black">
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
