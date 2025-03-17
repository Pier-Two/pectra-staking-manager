"use client";

import type { FC } from "react";
import { api } from "pec/trpc/react";
import { useRouter } from "next/navigation";
import { Connector } from "pec/components/validators/Connector";
import { Button } from "pec/components/ui/button";
import ValidatorsFoundLoading from "./loading";

const ValidatorsFound: FC = () => {
  const router = useRouter();
  const address = "XXX";
  const { data } = api.validators.getValidators.useQuery({ address });
  if (!data) return <ValidatorsFoundLoading />;

  const handleConsolidationRedirect = () => {
    router.push("/consolidate");
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
        <Button
          className="space-x-2 rounded-xl border border-gray-800 bg-black p-4 hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-200"
          onClick={handleConsolidationRedirect}
        >
          <div className="text-sm text-white dark:text-black">
            Start consolidation
          </div>
        </Button>

        <Button
          className="space-x-2 rounded-xl border border-gray-800 bg-white p-4 hover:bg-gray-200"
          onClick={handleDashboardRedirect}
        >
          <div className="text-sm text-black">Skip and go toDashboard</div>
        </Button>
      </div>
    </div>
  );
};

export default ValidatorsFound;
