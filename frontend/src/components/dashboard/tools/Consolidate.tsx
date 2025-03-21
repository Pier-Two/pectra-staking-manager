"use client";

import type { FC } from "react";
import { useRouter } from "next/navigation";
import { Merge, ArrowRight } from "lucide-react";
import { EIconPosition } from "pec/types/components";
import { TertiaryButton } from "pec/components/ui/custom/TertiaryButton";

export const Consolidate: FC = () => {
  const router = useRouter();

  const handleConsolidateRedirect = () => {
    router.push("/consolidate");
  };

  return (
    <div
      className="hover:border-3 group flex flex-col space-y-4 rounded-xl border p-4 pe-8 ps-8 hover:cursor-pointer text-white"
      onClick={handleConsolidateRedirect}
      style={{
        backgroundImage: "url(/cards/backgrounds/ConsolidateBackground.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-row items-center gap-x-2">
        <Merge className="rotate-90 text-orange-500" size={30} />
        <div className="text-2xl font-medium">Consolidate</div>
      </div>

      <div className="flex flex-col gap-y-4 pt-8">
        <div>
          Combine multiple Pectra validators (0x02 credentials) into one
          large-balance validator.
        </div>

        <TertiaryButton
          className="w-[40%]"
          label="Consolidate now"
          icon={<ArrowRight />}
          iconPosition={EIconPosition.RIGHT}
          onClick={handleConsolidateRedirect}
          disabled={false}
        />
      </div>
    </div>
  );
};
