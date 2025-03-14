import { Skeleton } from "pec/components/ui/skeleton";

const ValidatorsFoundLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="text-3xl text-gray-400">Loading Validators...</div>

      <Skeleton className="h-6 w-[40vw] rounded-lg" />
      <Skeleton className="h-6 w-[30vw] rounded-lg" />

      <Skeleton className="h-10 w-[20vw] rounded-lg" />

      <div className="flex w-full max-w-sm flex-col gap-4">
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
      </div>
    </div>
  );
};

export default ValidatorsFoundLoading;
