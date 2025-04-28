import { displayedEthAmount } from "pec/lib/utils/validators/balance";

interface IWalletBalance {
  balance: number;
}

export const WalletBalance = ({ balance }: IWalletBalance) => {
  return (
    <div className="flex flex-row items-center gap-1">
      <div className="font-inter text-xs text-[#52525B] dark:text-gray-500">
        Available balance:
      </div>

      <div className="font-inter text-xs font-semibold dark:text-white">
        Ξ {displayedEthAmount(balance)}
      </div>
    </div>
  );
};
