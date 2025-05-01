import type { FC } from "react";
import { Merge } from "lucide-react";

import { Skeleton } from "pec/components/ui/skeleton";

export const ConsolidateLoading: FC = () => {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className={"text-2xl font-570 leading-relaxed"}>
        <div className="flex gap-x-4">
          <Merge className="h-10 w-10 rotate-90 text-yellow-500" />
          <div className="text-3xl">Consolidate</div>
        </div>
      </div>
      <div className="text-left text-base">
        Combine multiple validator balances into a single large-balance
        validator, as per Pectra EIP-7251.
      </div>

      {/* Skeleton loaders for async data */}
      <div className="flex w-full flex-col space-y-4">
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
      </div>
    </div>
  );
};
