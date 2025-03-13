import { FC } from "react";
import { redirect } from "next/navigation";
import { IConnector } from "pec/types/validator";
import { Connector } from "pec/components/validatorsFound/connector";
import { Button } from "pec/components/ui/button";

const ValidatorsFound: FC<IConnector> = (props) => {
  const { connectedAddress, validators } = props;

  const handleConsolidationRedirect = () => {
    redirect("/consolidation");
  };

  const handleDashboardRedirect = () => {
    redirect("/dashboard");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-3xl">Validators found!</div>
        <div className="w-[40vw] text-center text-gray-700">
          You have {validators.length} total validators using this withdrawal
          address, consolidate them to Pectra standard now to get the most out
          of Ethereum staking
        </div>
      </div>

      <div>
        <Connector
          connectedAddress={connectedAddress}
          validators={validators}
        />
      </div>

      <Button onClick={handleConsolidationRedirect}>Start consolidation</Button>

      <Button onClick={handleDashboardRedirect}>
        Skip and go to Dashboard
      </Button>
    </div>
  );
};

export default ValidatorsFound;
