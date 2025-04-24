import { displayedEthAmount } from "pec/lib/utils/validators/balance";

interface IWalletBalance {
  balance: number;
}

export const WalletBalance = ({ balance }: IWalletBalance) => {
  return (
    <div className="flex flex-row items-center gap-1">
      <div className="text-xs text-gray-500 dark:text-gray-500">
        Available balance:
      </div>

      <div className="flex items-center gap-1 p-2">
        <div className="text-xs">Ξ</div>
        <div className="text-xs">{displayedEthAmount(balance)}</div>
      </div>
    </div>
  );
};
