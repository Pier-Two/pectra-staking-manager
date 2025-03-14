import type { FC } from "react";
import { api } from "pec/trpc/server";
import { Connector } from "pec/components/validatorsFound/connector";
import { Button } from "pec/components/ui/button";
import { Merge } from "lucide-react";
import { redirect } from "next/navigation";
import { Skeleton } from "pec/components/ui/skeleton";

const ConsolidationLoading: FC = async () => {
  const address = "XXX";
  const data = await api.validators.getValidators({ address });

  const handleConsolidationRedirect = () => {
    redirect("/consolidation");
  };

  const handleDashboardRedirect = () => {
    redirect("/dashboard");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-x-4">
          <Merge className="h-10 w-10 rotate-90 text-yellow-500" />
          <div className="text-3xl">Consolidate</div>
        </div>
        <div className="w-[40vw] text-center text-gray-700">
          Combine multiple validator balances into a single large-balance
          validator, as per Pectra EIP-7251.
        </div>

        {/* Skeleton loading for the Connector component */}
        {!data ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-[60vw] rounded-md" />
            <Skeleton className="h-12 w-[60vw] rounded-md" />
            <Skeleton className="h-12 w-[60vw] rounded-md" />
          </div>
        ) : (
          // Display the Connector component after data is loaded
          <Connector connectedAddress={address} validators={data} />
        )}
      </div>

      <div className="flex flex-col gap-4">
        {/* Button for consolidation */}
        <Button variant="default" onClick={handleConsolidationRedirect}>
          <div className="text-lg"> Start consolidation</div>
        </Button>

        {/* Button for dashboard redirect */}
        <Button variant="secondary" onClick={handleDashboardRedirect}>
          <div className="text-lg">Back to Dashboard</div>
        </Button>
      </div>
    </div>
  );
};

export default ConsolidationLoading;
