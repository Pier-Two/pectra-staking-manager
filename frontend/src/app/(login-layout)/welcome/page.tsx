import type { FC } from "react";
import { Footer } from "pec/components/layout/welcome/Footer";
import { Information } from "pec/components/layout/welcome/Information";
import { PectraLink } from "pec/components/layout/welcome/PectraLink";
import { ConnectWalletButton } from "pec/components/ui/wallet/ConnectWallet";
import { ChartLink } from "pec/components/layout/welcome/ChartLink";

const Welcome: FC = () => {
  return (
    <div className="mt-[5vh] flex h-full flex-col space-y-20">
      <div className="flex flex-col items-center justify-center gap-4">
        <PectraLink />
        <div className="text-6xl font-bold">This is the Future of</div>
        <div className="text-6xl font-bold">Ethereum Staking</div>
      </div>

      <div className="flex justify-center">
        <Information />
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <div className="text-center">
          Connect your withdrawal address to access validators
        </div>

        <div className="flex flex-col items-center justify-center gap-4 w-[25vw]">
          <ConnectWalletButton />
          <ChartLink numberOfUpgrades={123456} upgradePercentage={15} />
        </div>
      </div>

      <div className="flex justify-center">
        <Footer />
      </div>
    </div>
  );
};

export default Welcome;
