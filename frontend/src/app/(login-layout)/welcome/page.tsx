import { FC } from "react";
import { redirect } from "next/navigation";
import { Footer } from "pec/components/layout/welcome/Footer";
import { Information } from "pec/components/layout/welcome/Information";
import { PectraLink } from "pec/components/layout/welcome/PectraLink";
import { Button } from "pec/components/ui/button";

const Welcome: FC = () => {
  const navigateToValidatorsFound = () => {
    redirect("/validatorsFound");
  };

  return (
    <div className="flex h-full flex-col justify-center space-y-10">
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
        <Button
          className="w-[50%] rounded-xl border-gray-700 bg-black text-lg text-white hover:bg-gray-800 dark:border-gray-200 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300"
          onClick={navigateToValidatorsFound}
        >
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
