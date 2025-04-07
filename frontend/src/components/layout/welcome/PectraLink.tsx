import type { FC } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "pec/components/ui/button";

export const PectraLink: FC = () => {
  return (
    <div className="relative mb-8 inline-block md:mb-12">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00FFA7] via-[#A5B4FC] to-[#313C86]"></div>
      <Button
        onClick={() =>
          window.open("https://ethereum.org/en/roadmap/pectra/", "_blank")
        }
        variant="outline"
        className="relative m-[1px] rounded-full border-transparent bg-white hover:opacity-90 dark:bg-black"
      >
        <span className="font-medium">Pectra is here!</span>
        <span className="ml-2 flex items-center">
          Read announcement
          <ArrowRight className="ml-1 h-4 w-4" />
        </span>
      </Button>
    </div>
  );
};
