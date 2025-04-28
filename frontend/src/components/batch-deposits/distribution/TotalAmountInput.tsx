import { Input } from "pec/components/ui/input";
import type { DepositType } from "pec/lib/api/schemas/deposit";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { WalletBalance } from "./WalletBalance";

export interface ITotalAmountInput {
  amount: number;
  walletBalance: number;
  errors: FieldErrors<DepositType>;
  register: UseFormRegister<DepositType>;
}

export const TotalAmountInput = ({
  amount,
  walletBalance,
  register,
  errors,
}: ITotalAmountInput) => {
  return (
    <div className="space-y-2">
      <div className="text-sm font-670">Total Amount</div>
      <div className="space-y-1">
        <div className="flex w-full items-center rounded-md border bg-white px-4 py-1 text-black dark:border-gray-800 dark:bg-black dark:text-white">
          Ξ
          <Input
            className="w-full border-none px-2 py-1"
            type="number"
            step="any"
            {...register("totalToDistribute", {
              valueAsNumber: true,
              required: true,
              min: 0,
              max: walletBalance,
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
