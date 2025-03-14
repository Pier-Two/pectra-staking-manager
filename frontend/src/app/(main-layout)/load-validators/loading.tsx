"use client";

import { useEffect, type FC } from "react";
import { useRouter } from "next/navigation";
import { api } from "pec/trpc/react";
import { ConnectedAddress } from "pec/components/validators/connectedAddress";
import { LoaderCircle } from "lucide-react";
import { Skeleton } from "pec/components/ui/skeleton";

const LoadValidatorsPage: FC = () => {
  const router = useRouter();
  const address = "XXX";
  const { data, isLoading } = api.validators.getValidators.useQuery({
    address,
  });

  useEffect(() => {
    if (data) router.push("/validators-found");
  }, [data, router]);

  return (
    <div className="flex w-full flex-col gap-4">
      <ConnectedAddress address={address} />

      {/* Skeleton loading state */}
      {isLoading ? (
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
      ) : (
        // Fallback UI after data is loaded
        <div className="flex w-full flex-col items-center justify-between rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-black">
          <div className="text-md">
            Validators found for the provided address
          </div>
          {/* Additional content after data is loaded */}
        </div>
      )}
    </div>
  );
};

export default LoadValidatorsPage;
