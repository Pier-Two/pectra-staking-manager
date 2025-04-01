import type { FC } from "react";
import type { ITotalAmountInput } from "pec/types/batch-deposits";
import { Input } from "pec/components/ui/input";
import { AlignLeft } from "lucide-react";
import { WalletBalance } from "./WalletBalance";

export const TotalAmountInput: FC<ITotalAmountInput> = (props) => {
  const { amount, walletBalance, onChange } = props;

  return (
    <div className="space-y-2">
      <div className="text-md font-medium">Total Amount</div>
      <div className="space-y-1">
        <div className="flex w-full items-center rounded-xl bg-white p-4 text-black dark:bg-black dark:text-white">
          <AlignLeft className="h-4 w-4" />
          <Input
            className="w-full border-none"
            placeholder="Enter total amount to deposit"
            value={amount || ""}
            type="number"
            onChange={onChange}
          />
        </div>

        <WalletBalance balance={walletBalance} />

        {amount === 0 && (
          <div className="text-xs text-red-700 dark:text-red-300">
            Please select an amount to distribute.
          </div>
        )}
      </div>
    </div>
  );
};
