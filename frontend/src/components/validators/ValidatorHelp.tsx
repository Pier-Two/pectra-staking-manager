"use client";

import { type FC, useState } from "react";
import { Separator } from "../ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";

export const ValidatorHelp: FC = () => {
  const [openWhatIs, setOpenWhatIs] = useState(false);
  const [openWhyConsolidate, setOpenWhyConsolidate] = useState(false);
  const [openNewFeatures, setOpenNewFeatures] = useState(false);

  return (
    <div className="flex w-full flex-col gap-y-1 rounded-xl border border-gray-400 bg-white px-4 py-2 dark:border-gray-800 dark:bg-black text-sm">
      <div
        className="flex items-center justify-between hover:cursor-pointer"
        onClick={() => setOpenWhatIs(!openWhatIs)}
      >
        <div className="text-md">What is validator consolidation?</div>
        <Button variant="ghost" size="icon">
          {openWhatIs ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>

      {openWhatIs && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Validator consolidation is the process of combining multiple
          validators into a single validator.
        </div>
      )}

      <Separator className="bg-gray-400 dark:bg-gray-800" />

      <div
        className="flex items-center justify-between hover:cursor-pointer"
        onClick={() => setOpenWhyConsolidate(!openWhyConsolidate)}
      >
        <div className="text-md">Why should I consolidate?</div>
        <Button variant="ghost" size="icon">
          {openWhyConsolidate ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>

      {openWhyConsolidate && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Consolidating your validators allows you to take advantage of enhanced
          staking features.
        </div>
      )}

      <Separator className="bg-gray-400 dark:bg-gray-800" />

      <div
        className="flex items-center justify-between hover:cursor-pointer"
        onClick={() => setOpenNewFeatures(!openNewFeatures)}
      >
        <div>
          What new staking features does consolidating enable?
        </div>

        <Button variant="ghost" size="icon">
          {openNewFeatures ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>

      {openNewFeatures && (
        <div className="break-words text-gray-500 dark:text-gray-400 text-xs">
          Allows Ethereum validators to increase their maximum effective balance
          from 32 ETH to 2,048 ETH. This enhancement enables validators to
          combine multiple smaller stakes into a single larger one, simplifying
          management and reducing operational overhead. Additionally, it
          facilitates reward compounding, as higher balances accrue staking
          rewards more efficiently.
        </div>
      )}
    </div>
  );
};
