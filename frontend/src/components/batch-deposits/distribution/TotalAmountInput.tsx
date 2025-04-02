import type { FC } from "react";
import type { ITotalAmountInput } from "pec/types/batch-deposits";
import { AlignLeft } from "lucide-react";
import { WalletBalance } from "./WalletBalance";
import type { DepositType } from "pec/lib/api/schemas/deposit";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

interface ExtendedProps extends ITotalAmountInput {
  errors: FieldErrors<DepositType>;
  register: UseFormRegister<DepositType>;
}

export const TotalAmountInput: FC<ExtendedProps> = (props) => {
  const { amount, walletBalance, register, errors } = props;

  return (
    <div className="space-y-2">
      <div className="text-md font-medium">Total Amount</div>
      <div className="space-y-1">
        <div className="flex w-full items-center rounded-xl bg-white p-4 text-black dark:bg-black dark:text-white">
          <AlignLeft className="h-4 w-4" />
          <input
            className="w-full border-none px-2 py-1"
            type="number"
            step="any"
            {...register("totalToDistribute", {
              valueAsNumber: true,
              setValueAs: (value: string) => {
                if (value === "") return 0;
                if (isNaN(Number(value))) return 0;
                if (parseFloat(value) > walletBalance) return undefined;
                return parseFloat(value);
              },
            })}
          />
        </div>

        {errors.totalToDistribute && (
          <div className="mt-1 text-xs text-red-500">
            Please enter an amount less than or equal to your available balance.
          </div>
        )}

        <WalletBalance balance={walletBalance} />

        {!errors.totalToDistribute && amount === 0 && (
          <div className="text-xs text-red-700 dark:text-red-300">
            Please select an amount to distribute.
          </div>
        )}
      </div>
    </div>
  );
};
