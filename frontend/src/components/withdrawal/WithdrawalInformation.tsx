import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";
import { displayedEthAmount } from "pec/lib/utils/validators/balance";
import type { WithdrawWorkflowStages } from "pec/types/withdraw";
import { PectraSpinner } from "../ui/custom/pectraSpinner";
import { PrimaryButton } from "../ui/custom/PrimaryButton";
import { SecondaryButton } from "../ui/custom/SecondaryButton";
import { Separator } from "../ui/separator";
import { cn } from "pec/lib/utils";
import { useFormContext } from "react-hook-form";
import { FormWithdrawalType } from "pec/lib/api/schemas/withdrawal";

export interface IWithdrawalInformation {
  buttonText: string;
  disabled: boolean;
  handleMaxAllocation: (type: "partial" | "full") => void;
  onSubmit: () => void;
  resetWithdrawal: () => void;
  stage: WithdrawWorkflowStages;
  validatorsSelected: number;
  withdrawalTotal: number;
  numValidators: number;
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
  numValidators,
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

  const { watch, resetField } = useFormContext<FormWithdrawalType>();

  const withdrawals = watch("withdrawals");

  const isMaxPartialWithdrawal =
    withdrawals.length === numValidators &&
    withdrawals.every(
      (withdrawal) => withdrawal.amount === withdrawal.validator.balance - 32,
    );

  const isMaxFullExit =
    withdrawals.length === numValidators &&
    withdrawals.every(
      (withdrawal) => withdrawal.amount === withdrawal.validator.balance,
    );

  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-border bg-white p-4 dark:border-gray-800 dark:bg-black">
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
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
                        width={14}
                        height={14}
                        className=""
                      />
                    )}
                    <div className="font-inter text-sm font-670">
                      {stat.value}
                    </div>
                  </div>

                  <div className="font-inter text-xs font-380 text-gray-500 dark:text-gray-500">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {(isSigning || isSubmitting || isPending) &&
            !allTransactionsFinalised && (
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
        </div>

        {stage.type === "data-capture" && (
          <div className="relative flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <SecondaryButton
                className={cn("flex-1", {
                  "bg-indigo-500 text-white hover:bg-indigo-500 hover:text-white":
                    isMaxPartialWithdrawal,
                })}
                label="Max Partial Withdrawal"
                disabled={false}
                onClick={() => {
                  if (isMaxPartialWithdrawal) {
                    resetField("withdrawals");
                    return;
                  }
                  handleMaxAllocation("partial");
                }}
              />
              <SecondaryButton
                className={cn("flex-1 text-red-500 hover:text-red-500", {
                  "bg-red-500 text-white hover:bg-red-500 hover:text-white":
                    isMaxFullExit,
                })}
                label="Max Full Exit"
                disabled={false}
                onClick={() => {
                  if (isMaxFullExit) {
                    resetField("withdrawals");
                    return;
                  }
                  handleMaxAllocation("full");
                }}
              />
            </div>

            <PrimaryButton
              label={buttonText}
              disabled={!disabled}
              onClick={onSubmit}
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {someTransactionsFailed && (
          <>
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
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSubmitting && (
          <>
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
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
