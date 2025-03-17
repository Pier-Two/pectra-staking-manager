import type { FC } from "react";
import { Footer } from "pec/components/layout/welcome/Footer";
import { Information } from "pec/components/layout/welcome/Information";
import { PectraLink } from "pec/components/layout/welcome/PectraLink";
import { ConnectWalletButton } from "pec/components/ui/wallet/ConnectWallet";

const Welcome: FC = () => {
  return (
    <div className="mt-[5vh] flex h-full flex-col space-y-10">
      <div className="flex justify-center">
        <PectraLink />
      </div>

      <div>
        <div className="flex justify-center text-6xl font-bold">
          This is the Future of
        </div>

        <div className="flex justify-center text-6xl font-bold">
          Ethereum Staking
        </div>
      </div>

      <div className="flex justify-center">
        <Information />
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="text-center">
          Connect your withdrawal address to access validators
        </div>
        <ConnectWalletButton />
      </div>

      <div className="flex justify-center">
        <Footer />
      </div>
    </div>
  );
};

export default Welcome;
