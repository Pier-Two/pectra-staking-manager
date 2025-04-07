"use client";

import type { FC } from "react";
import { useRouter } from "next/navigation";
import { Merge } from "lucide-react";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";

export const Consolidate: FC = () => {
  const router = useRouter();

  const handleConsolidateRedirect = () => {
    router.push("/consolidate");
  };

  return (
    <div
      className="hover:bg-activeCard hover:border-3 group flex flex-col space-y-4 rounded-xl border border-indigo-200 bg-white p-4 pe-8 ps-8 text-gray-900 hover:cursor-pointer hover:text-white dark:border-gray-700 dark:bg-black dark:text-white"
      onClick={handleConsolidateRedirect}
    >
      <div className="flex flex-row items-center gap-x-2 text-indigo-800 group-hover:text-orange-400 dark:text-indigo-200">
        <Merge className="rotate-90" size={30} />
        <div className="text-2xl font-medium">Consolidate</div>
      </div>

      <div className="flex flex-col gap-y-4 pt-8">
        <div className="text-sm">
          Combine multiple Pectra validators (0x02 credentials) into one
          large-balance validator.
        </div>

        <PrimaryButton
          className="w-auto group-hover:bg-white group-hover:text-indigo-800 dark:group-hover:bg-white dark:group-hover:text-indigo-800"
          label="Consolidate now"
          onClick={handleConsolidateRedirect}
          disabled={false}
        />
      </div>
    </div>
  );
};
