import { ChevronRight } from "lucide-react";
import { Button } from "pec/components/ui/button";
import type { FC } from "react";

export const PectraLink: FC = () => {
  return (
    <div className="relative inline-block z-10">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00FFA7] via-[#A5B4FC] to-[#313C86]"></div>
      <Button
        onClick={() =>
          window.open("https://ethereum.org/en/roadmap/pectra/", "_blank")
        }
        variant="outline"
        className="relative m-[1px] !h-auto gap-x-4 rounded-full border-transparent bg-white !px-4 !py-2 hover:opacity-90 dark:bg-black"
      >
        <p className="font-570 mt-[1px] text-[13px] leading-[13px] text-zinc-950">
          Pectra is here!
        </p>
        <div className="flex items-center">
          <p className="font-570 mt-[1px] text-[13px] leading-[13px] text-zinc-950">
            Read announcement
          </p>
          <ChevronRight className="h-4 w-4" />
        </div>
      </Button>
    </div>
  );
};
