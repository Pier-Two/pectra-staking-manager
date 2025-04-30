import { Skeleton } from "pec/components/ui/skeleton";
import type { FC } from "react";

const WithdrawalLoading: FC = () => {
  return (
    <div className="flex w-full flex-col space-y-4">
      <Skeleton className="h-12" />
      <Skeleton className="h-12" />
      <Skeleton className="h-12" />
      <Skeleton className="h-12" />
      <Skeleton className="h-12" />
    </div>
  );
};

export default WithdrawalLoading;
