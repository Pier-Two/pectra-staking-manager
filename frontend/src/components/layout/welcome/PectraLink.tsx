import type { FC } from "react";
import { ChevronRight } from "lucide-react";

export const PectraLink: FC = () => {
  return (
    <div className="p-[1px] rounded-xl bg-gradient-to-r from-[#FDBA74] via-[#A5B4FC] to-[#86EFAC] w-[30vw]">
      <a
        href="https://ethereum.org/en/roadmap/pectra/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-2 gap-x-12 rounded-xl bg-white pb-1 pe-6 ps-6 pt-1 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <span>Pectra is here!</span>
        <div className="flex items-center gap-2">
          <span>Read announcement </span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </a>
    </div>
  );
};
