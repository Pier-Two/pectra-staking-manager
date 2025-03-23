import type { FC } from "react";
import { ChevronRight } from "lucide-react";

export const PectraLink: FC = () => {
  return (
    <div className="w-[30%] p-[1px] rounded-xl bg-gradient-to-r from-[#00FFA7] via-[#5164DC] to-[#313C86] text-xs overflow-auto">
      <a
        href="https://ethereum.org/en/roadmap/pectra/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center min-h-8 justify-between rounded-xl bg-white pb-1 pe-6 ps-6 pt-1 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <div>Pectra is here!</div>
        <div className="flex items-center gap-2">
          <div>Read announcement </div>
          <ChevronRight className="h-4 w-4" />
        </div>
      </a>
    </div>
  );
};
