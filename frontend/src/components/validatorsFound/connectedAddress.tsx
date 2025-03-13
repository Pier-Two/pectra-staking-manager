import { FC } from "react";
import Image from "next/image";
import { IConnectedAddress } from "pec/types/validator";
import { Power } from "lucide-react";

export const ConnectedAddress: FC<IConnectedAddress> = (props) => {
  const { address } = props;

  return (
    <div className="flex-col-2 flex w-full min-h-[10vh] items-center justify-between rounded-xl border bg-white dark:bg-black border-gray-200 p-2 dark:border-gray-800">
      <div className="flex items-center gap-x-4">
        <Image src="/icons/Wallet.svg" alt="Wallet" width={24} height={24} />

        <div className="flex flex-col">
          <div className="text-md">Connected with</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        </div>
      </div>

      <Power className="text-gray-800 dark:text-white h-4 w-4" />
    </div>
  );
};
