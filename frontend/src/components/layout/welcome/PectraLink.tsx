import type { FC } from "react";
import { ChevronRight } from "lucide-react";

export const PectraLink: FC = () => {
  return (
    <div className="w-[30%] overflow-auto rounded-xl bg-gradient-to-r from-[#00FFA7] via-[#5164DC] to-[#313C86] p-[1px] text-xs">
      <a
        href="https://ethereum.org/en/roadmap/pectra/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-8 items-center rounded-xl bg-gray-100 pb-1 pe-6 ps-6 pt-1 transition-colors hover:bg-gray-100 hover:bg-white dark:bg-black dark:hover:bg-gray-900"
      >
        <div className="flex w-full flex-row justify-between">
          <div>Pectra is here!</div>
          <div className="flex items-center gap-2">
            <div>Read announcement </div>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </a>
    </div>
  );
};
