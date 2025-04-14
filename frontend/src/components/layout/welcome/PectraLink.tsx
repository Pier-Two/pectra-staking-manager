import { ChevronRight } from "lucide-react";
import { Button } from "pec/components/ui/button";
import type { FC } from "react";

export const PectraLink: FC = () => {
  return (
    <div className="relative inline-block">
      <div className="absolute inset-0 rounded-full bg-[linear-gradient(170.54deg,#00FFA7_11.34%,#5164DC_31.73%,#313C86_59.22%,rgba(113,255,224,0.8)_100%)]">
        <div className="absolute inset-[1px] rounded-full bg-indigo-50 dark:bg-gray-950"></div>
      </div>
      <Button
        onClick={() =>
          window.open("https://ethereum.org/en/roadmap/pectra/", "_blank")
        }
        variant="outline"
        className="relative !h-auto gap-x-4 rounded-full border-0 bg-[linear-gradient(170.54deg,rgba(253,186,116,0.15)_11.34%,rgba(165,180,252,0.15)_53.87%,rgba(134,239,172,0.15)_100%)] !px-4 !py-2"
      >
        <p className="mt-[1px] text-[13px] font-570 leading-[13px] text-zinc-950 dark:text-zinc-50">
          Pectra is here!
        </p>
        <div className="flex items-center">
          <p className="mt-[1px] text-[13px] font-570 leading-[13px] text-zinc-950 dark:text-zinc-50">
            Read announcement
          </p>
          <ChevronRight className="h-4 w-4" />
        </div>
      </Button>
    </div>
  );
};
