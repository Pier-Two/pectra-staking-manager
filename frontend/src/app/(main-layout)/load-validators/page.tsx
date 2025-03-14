"use client";

import { useEffect, type FC } from "react";
import { useRouter } from "next/navigation";
import { api } from "pec/trpc/react";
import { ConnectedAddress } from "pec/components/validatorsFound/connectedAddress";
import { LoaderCircle } from "lucide-react";

const LoadValidatorsPage: FC = () => {
  const router = useRouter();
  const address = "XXX";
  const { data } = api.validators.getValidators.useQuery({ address });

  useEffect(() => {
    if (data) router.push("/validators-found");
  }, [data, router]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex w-[50vw] flex-col gap-4">
        <ConnectedAddress address={address} />

        <div className="flex-col-2 flex min-h-[10vh] w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black">
          <div className="flex items-center gap-x-4">
            <LoaderCircle className="h-5 w-5 animate-spin text-gray-800 dark:text-white" />

            <div className="flex flex-col">
              <div className="text-md">
                Finding validators with this withdrawal address
              </div>
            </div>
          </div>
        </div>

        <div className="text-md flex justify-center">Please wait...</div>
      </div>
    </div>
  );
};

export default LoadValidatorsPage;
