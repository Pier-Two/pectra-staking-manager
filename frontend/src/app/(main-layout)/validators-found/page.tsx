"use client";

import type { FC } from "react";
import { api } from "pec/trpc/react";
import { useRouter } from "next/navigation";
import { Connector } from "pec/components/validatorsFound/connector";
import { Button } from "pec/components/ui/button";
import ValidatorsFoundLoading from "./loading";

const ValidatorsFound: FC = () => {
  const router = useRouter();
  const address = "XXX";
  const { data } = api.validators.getValidators.useQuery({ address });
  if (!data) return <ValidatorsFoundLoading />;

  const handleConsolidationRedirect = () => {
    router.push("/consolidation/workflow");
  };

  const handleDashboardRedirect = () => {
    router.push("/dashboard");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-3xl">Validators found!</div>
        <Connector connectedAddress={address} validators={data} />
      </div>

      <div className="flex flex-col gap-4">
        <Button variant="default" onClick={handleConsolidationRedirect}>
          <div className="text-lg"> Start consolidation</div>
        </Button>

        <Button variant="secondary" onClick={handleDashboardRedirect}>
          <div className="text-lg">Skip and go to Dashboard</div>
        </Button>
      </div>
    </div>
  );
};

export default ValidatorsFound;
