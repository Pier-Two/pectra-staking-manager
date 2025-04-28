import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";
import { cn } from "pec/lib/utils";
import { displayedEthAmount } from "pec/lib/utils/validators/balance";
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
  availableValidators: number;
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
  availableValidators,
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
      icon: "Ξ",
      value: displayedEthAmount(withdrawalTotal),
      label: "Withdrawal total",
    },
  ];

  const someTransactionsFailed =
    stage.type === "sign-submit-finalise" &&
    Object.values(stage.txHashes).some(
      (tx) => tx.status === "failed" || tx.status === "failedToSubmit",
    );

  const isPending =
  stage.type === "sign-submit-finalise" &&
  Object.values(stage.txHashes).some((tx) => tx.status === "pending");

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
    Object.values(stage.txHashes).every(
      (tx) => tx.status === "finalised" || tx.status === "failed",
    );

  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-indigo-400 bg-white p-4 dark:border dark:border-gray-800 dark:bg-black">
      <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-wrap items-center gap-10">
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
          {(isSigning || isSubmitting || isPending) && !allTransactionsFinalised && (
            <div className="flex flex-row items-center gap-2">
              <PectraSpinner />
              {isPending && (
                <div className="text-sm">Awaiting Signatures...</div>
              )}
              {isSubmitting && (
                <div className="text-sm">Submitting Transactions...</div>
              )}
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
            <div className="flex flex-row gap-2 md:gap-4 items-center relative">
              <div
                className={cn(
                  "transition-all duration-500 ease-in-out",
                  validatorsSelected !== availableValidators
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-8 pointer-events-none"
                )}
              >
                <SecondaryButton
                  className="border-gray-200 dark:border-gray-800"
                  label="Max"
                  disabled={false}
                  onClick={() => {
                    handleMaxAllocation();
                  }}
                />
              </div>

              <PrimaryButton
                className={cn(
                  "w-60 transition-all duration-500 ease-in-out",
                  validatorsSelected === availableValidators && "mr-16 md:mr-4 w-64"
                )}
                label={buttonText}
                disabled={!disabled}
                onClick={onSubmit}
              />
            </div>
          )}
        </div>
      </div>

      {someTransactionsFailed && (
        <AnimatePresence>
          <motion.div
            key="failed-transactions"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl bg-gray-100 p-2 text-sm text-gray-500 dark:bg-black"
          >
            Some transactions failed. Please check your validator statuses and
            try again.
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <PrimaryButton
              label="Make another withdrawal"
              onClick={resetWithdrawal}
              disabled={false}
            />
          </motion.div>
        </AnimatePresence>
      )}

      {isSubmitting && (
        <AnimatePresence>
          <motion.div
            key="submitted-transactions"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl bg-green-100 p-2 text-sm text-green-500 dark:bg-black"
          >
            Your transactions have been submitted successfully and will be
            processed shortly. You can leave this page and check the status of
            your withdrawals in your dashboard.
          </motion.div>

          <motion.div
            key="make-another-withdrawal"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full"
          >
            <PrimaryButton
              className="w-full"
              label="Make another withdrawal"
              onClick={resetWithdrawal}
              disabled={false}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
