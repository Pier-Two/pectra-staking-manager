import type { FC } from "react";
import { LoaderCircle } from "lucide-react";
import { Skeleton } from "pec/components/ui/skeleton";
import { ConnectedAddress } from "pec/components/validators/connectedAddress";

const LoadValidatorsLoading: FC = () => {
  const address = "XXX";

  return (
    <div className="flex w-full flex-col gap-4">
      <ConnectedAddress address={address} />

      {/* Skeleton loading state */}
      <div className="flex w-full flex-col items-center justify-between rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-black">
        <div className="flex items-center gap-x-4">
          <LoaderCircle className="h-5 w-5 animate-spin text-gray-800 dark:text-white" />
          <div className="flex flex-col">
            <div className="text-md">
              Finding validators with this withdrawal address
            </div>
          </div>
        </div>

        <div className="text-md flex justify-center">Please wait...</div>

        {/* Skeleton loader for content */}
        <div className="mt-4 w-full space-y-3">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default LoadValidatorsLoading;
