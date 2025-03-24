import type { FC } from "react";
import { KeyRound } from "lucide-react";

export const SignatureDetails: FC = () => {
  return (
    <div className="flex min-h-[10vh] w-full items-center justify-between gap-x-4 rounded-xl border border-indigo-300 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-gray-900">
      <div className="flex gap-x-4">
        <KeyRound className="h-8 w-8 fill-indigo-500 text-white" />
        <div className="flex flex-col gap-y-2">
          <div className="text-md text-indigo-700">
            Validators signatures required to submit deposits
          </div>

          <div className="text-sm">
            To submit deposits, you&apos;ll need to generate and provide
            signatures with your validator key pairs (not withdrawal address).
            You will be prompted to create these signatures once deposit data is
            generated.
          </div>
        </div>
      </div>
    </div>
  );
};
