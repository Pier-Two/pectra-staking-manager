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
    <div className="flex flex-col w-full gap-y-4 rounded-xl rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black">
      <div className="flex items-center justify-between">
        <div className="text-md">What is validator consolidation?</div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpenWhatIs(!openWhatIs)}
        >
          {openWhatIs ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>

      {openWhatIs && (
        <div className="text-sm text-gray-500 dark:text-gray-300">
          Validator consolidation is the process of combining multiple
          validators into a single validator.
        </div>
      )}

      <Separator className="bg-gray-200 dark:bg-gray-800" />

      <div className="flex items-center justify-between">
        <div className="text-md">Why should I consolidate?</div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpenWhyConsolidate(!openWhyConsolidate)}
        >
          {openWhyConsolidate ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>

      {openWhyConsolidate && (
        <div className="text-sm text-gray-500 dark:text-gray-300">
          Consolidating your validators allows you to take advantage of enhanced
          staking features.
        </div>
      )}

      <Separator className="bg-gray-200 dark:bg-gray-800" />

      <div className="flex items-center justify-between">
        <div className="text-md">
          What new staking features does consolidating enable?
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpenNewFeatures(!openNewFeatures)}
        >
          {openNewFeatures ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>

      {openNewFeatures && (
        <div className="break-words text-sm text-gray-500 dark:text-gray-300">
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
