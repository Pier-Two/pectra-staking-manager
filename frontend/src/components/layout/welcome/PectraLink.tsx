import { ChevronRight } from "lucide-react";
import { Button } from "pec/components/ui/button";
import { GlowEffect } from "pec/components/ui/glow-effect";
import type { FC } from "react";

export const PectraLink: FC = () => {
  return (
    <div className="relative">
      <GlowEffect
        colors={["#FDBA74", "#5164DC", "#86EFAC", "#313C86"]}
        mode="pulse"
        blur="softest"
        duration={3}
        scale={1}
      />

      <Button
        onClick={() => {
          window.open("https://ethereum.org/en/roadmap/pectra/", "_blank");
        }}
        variant="outline"
        className="relative !h-auto gap-x-4 rounded-full border-border bg-zinc-50 !px-4 !py-2 hover:bg-zinc-50 dark:border-gray-700 dark:bg-gray-950 dark:hover:bg-gray-950"
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
