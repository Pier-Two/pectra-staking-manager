"use client";

import { labrysUrl, openInNewTab, pierTwoUrl } from "pec/helpers/getExternalLink";
import type { FC } from "react";
import { RenderLogo } from "../BottomBar";

export const Footer: FC = () => {

  return (
    <div className="mt-9 flex flex-col items-center font-inter text-xs font-light">
      <div className="flex flex-row gap-20 text-gray-500 dark:text-gray-400">
        <div className="flex flex-col items-center gap-y-3 hover:cursor-pointer" onClick={() => openInNewTab(pierTwoUrl)}>
          <div className="text-[11px] leading-[11px] text-zinc-600">
            Product by
          </div>
          <RenderLogo logo="PierTwo" width={150} height={150} />
          <div className="text-[11px] leading-[11px] text-zinc-600">
            Onchain infrastructure
          </div>
        </div>

        <div className="flex flex-col items-center gap-y-3 hover:cursor-pointer" onClick={() => openInNewTab(labrysUrl)}>
          <div className="text-[11px] leading-[11px] text-zinc-600">
            Produced by
          </div>
          <RenderLogo logo="Labrys" width={150} height={150} />
          <div className="text-[11px] leading-[11px] text-zinc-600">
            Onchain developers
          </div>
        </div>
      </div>
    </div>
  );
};
