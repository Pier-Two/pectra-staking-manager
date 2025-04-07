import type { FC } from "react";
import type { IWalletBalance } from "pec/types/batch-deposits";
import { AlignLeft } from "lucide-react";
import { DECIMAL_PLACES } from "pec/lib/constants";

export const WalletBalance: FC<IWalletBalance> = ({ balance }) => {
  return (
    <div className="flex flex-row items-center gap-1">
      <div className="text-xs text-gray-500 dark:text-gray-500">
        Available balance:
      </div>

      <div className="flex items-center gap-1 p-2">
        <AlignLeft className="h-4 w-4" />
        <div className="text-xs">{balance.toFixed(DECIMAL_PLACES)}</div>
      </div>
    </div>
  );
};
