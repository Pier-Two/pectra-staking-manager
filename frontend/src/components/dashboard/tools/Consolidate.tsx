"use client";

import type { FC } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, Merge, ArrowUpRight } from "lucide-react";
import { Separator } from "pec/components/ui/separator";
import { Button } from "pec/components/ui/button";

export const Consolidate: FC = () => {
  const router = useRouter();

  const handleConsolidateRedirect = () => {
    router.push("/consolidate");
  };

  return (
    <div
      className="hover:border-3 group flex flex-col space-y-4 rounded-xl border bg-white p-4 pe-8 ps-8 hover:cursor-pointer hover:border-black dark:border-gray-800 dark:bg-black dark:hover:border-yellow-400"
      onClick={handleConsolidateRedirect}
    >
      <div className="flex flex-shrink-0 flex-grow flex-row items-center gap-8">
        <Merge className="rotate-90 group-hover:text-yellow-500" size={70} />
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between">
            <div className="text-lg font-medium">Consolidate</div>
            <ArrowUpRight className="group-hover:text-yellow-500" size={20} />
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            Combine multiple Pectra validators (0x02 credentials) into one
            large-balance validator.
          </div>
        </div>
      </div>

      <Separator className="bg-gray-200 dark:bg-gray-800" />

      <div className="flex items-center justify-between text-sm">
        <div className="flex flex-row items-center gap-x-2">
          <CircleAlert fill="orange" className="text-white dark:text-black" />

          <div>XXX validators not on Pectra standard</div>
        </div>

        <Button className="rounded-lg border bg-gray-100 hover:bg-gray-200 dark:border-gray-800 dark:bg-black dark:hover:bg-gray-900">
          Fix
        </Button>
      </div>
    </div>
  );
};
