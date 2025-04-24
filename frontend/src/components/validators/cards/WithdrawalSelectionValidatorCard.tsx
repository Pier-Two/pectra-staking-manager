import { CircleCheck, CircleMinus, CirclePlus } from "lucide-react";
import Image from "next/image";
import { Input } from "pec/components/ui/input";
import type { WithdrawalFormType } from "pec/lib/api/schemas/withdrawal";
import { cn } from "pec/lib/utils";
import { parseEtherToFixedDecimals } from "pec/lib/utils/parseAmounts";
import { type ValidatorDetails } from "pec/types/validator";
import type { WithdrawWorkflowStages } from "pec/types/withdraw";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";
import { formatEther } from "viem";
import { ValidatorLoadingCard } from "./ValidatorLoadingCard";
interface ExtendedProps {
  availableAmount: bigint;
  handleSelect: () => void;
  withdrawalIndex: number;
  selected: boolean;
  stage: WithdrawWorkflowStages;
  validator: ValidatorDetails;
  errors: FieldErrors<WithdrawalFormType>;
  register: UseFormRegister<WithdrawalFormType>;
}

export const WithdrawalSelectionValidatorCard = ({
  errors,
  handleSelect,
  register,
  withdrawalIndex,
  selected,
  validator,
  stage,
}: ExtendedProps) => {
  const locked = validator.balance === 0n;
  const { validatorIndex, publicKey, balance } = validator;
  const signSubmitFinaliseInProgress = stage.type === "sign-submit-finalise";
  const transactionStatus = signSubmitFinaliseInProgress
    ? stage?.txHashes[validatorIndex]
    : undefined;

  // IF we are submitting a withdrawal and the validator is not being withdrawn from, don't render the card
  if (signSubmitFinaliseInProgress && !transactionStatus) {
    return null;
  }

  // IF we are submitting a withdrawal and the validator is being withdrawn from, render the card with the status
  if (signSubmitFinaliseInProgress && transactionStatus) {
    return (
      <ValidatorLoadingCard
        transactionStatus={transactionStatus}
        validator={validator}
      />
    );
  }

  const onClickHandler = () => {
    if (locked) return;

    handleSelect();
  };

  const setValueHandler = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 0;

    if (numValue > Number(formatEther(validator.balance)))
      return Number(formatEther(validator.balance));

    return numValue;
  };

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-x-4 rounded-xl border bg-white px-4 py-3",
        "dark:border-gray-800 dark:bg-black",
        {
          "opacity-50": locked,
          "group hover:border-indigo-500 dark:hover:border-gray-600": !locked,
          "border-indigo-500 dark:border-2 dark:border-indigo-900": selected,
          "cursor-pointer": !locked,
        },
      )}
    >
      <div
        className="flex flex-[1.2] items-center gap-x-4"
        onClick={onClickHandler}
      >
        {selected && !locked ? (
          <>
            <CircleCheck className="h-4 min-h-4 w-4 min-w-4 text-green-500 group-hover:hidden" />
            <CircleMinus className="hidden h-4 min-h-4 w-4 min-w-4 text-red-500 group-hover:block" />
          </>
        ) : (
          <CirclePlus className="h-4 min-h-4 w-4 min-w-4 text-indigo-500 group-hover:fill-indigo-500 group-hover:text-white" />
        )}

        <Image
          src="/icons/EthValidator.svg"
          alt="Validator"
          width={24}
          height={24}
        />

        <div className="flex flex-col">
          <div className="text-sm">{validatorIndex}</div>
          <div className="text-xs text-gray-700 dark:text-gray-300">
            {publicKey.slice(0, 5)}...{publicKey.slice(-4)}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col" onClick={onClickHandler}>
        <div className="flex items-center gap-1">
          Ξ <div className="text-sm">{parseEtherToFixedDecimals(balance)}</div>
        </div>

        <div className="flex items-center gap-1 py-1 text-gray-700 dark:text-gray-300">
          <div className="text-sm">
            Ξ {parseEtherToFixedDecimals(validator.balance)} available
          </div>
        </div>
      </div>

      <div className="flex-1">
        {selected ? (
          <div className="flex">
            <div className="flex w-full flex-col">
              <div className="flex flex-row items-center gap-2">
                <span className="text-sm">ETH</span>
                <Input
                  className={`w-full rounded-xl border border-indigo-300 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-black dark:text-gray-300 ${locked ? "opacity-50" : ""}`}
                  disabled={locked}
                  type="number"
                  step="any"
                  {...register(`withdrawals.${withdrawalIndex}.amount`, {
                    // valueAsNumber: true,
                    // required: true,
                    // min: 0,
                    setValueAs: setValueHandler,
                  })}
                />
              </div>

              {errors.withdrawals?.[withdrawalIndex]?.amount && (
                <div className="mt-1 text-xs text-red-500">
                  Please enter an amount less than or equal to your available
                  balance.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            Ξ{" "}
            <Input
              className="w-full rounded-xl border-none bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-black dark:text-gray-300"
              disabled
              type="number"
              value={0}
            />
          </div>
        )}
      </div>
    </div>
  );
};
