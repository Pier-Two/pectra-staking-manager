import { Footer } from "pec/components/layout/welcome/Footer";
import { Information } from "pec/components/layout/welcome/Information";
import { PectraLink } from "pec/components/layout/welcome/PectraLink";
import { Button } from "pec/components/ui/button";
import { FC } from "react";

const Welcome: FC = () => {
  return (
    <div className="space-y-10 h-full flex flex-col justify-center">
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
        <Button className="w-[50%] rounded-xl border-gray-700 bg-black text-lg text-white hover:bg-gray-800 dark:border-gray-200 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300">
          Connect Wallet
        </Button>
      </div>

      <div className="flex justify-center">
        <Footer />
      </div>
    </div>
  );
};

export default Welcome;
