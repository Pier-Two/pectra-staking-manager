import { Skeleton } from "pec/components/ui/skeleton";

export const BatchDepositLoading = () => {
  return (
    <>
      <div className="mx-auto w-full space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-12" />
          <Skeleton className="h-40" />
          <Skeleton className="h-10" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-12" />
          <Skeleton className="h-40" />
          <Skeleton className="h-10" />
        </div>
      </div>
    </>
  );
};
