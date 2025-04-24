"use client";

import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi";
import { type FC, useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export const ValidatorHelp: FC = () => {
  const [openWhatIs, setOpenWhatIs] = useState(false);
  const [openWhyConsolidate, setOpenWhyConsolidate] = useState(false);
  const [openNewFeatures, setOpenNewFeatures] = useState(false);

  return (
    <div className="flex w-full flex-col rounded-lg border border-border bg-white px-4 text-left text-sm dark:border-gray-800 dark:bg-black">
      <div
        className="flex h-[52px] items-center justify-between hover:cursor-pointer"
        onClick={() => setOpenWhatIs(!openWhatIs)}
      >
        <p className="text-[13px] font-570 text-zinc-950 dark:text-zinc-50">
          What is validator consolidation?
        </p>
        <Button variant="ghost" size="icon">
          {openWhatIs ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}
        </Button>
      </div>

      {openWhatIs && (
        <p className="pb-4 text-[12px] leading-[14px] text-zinc-950 dark:text-zinc-50">
          Validator consolidation is the process of combining multiple
          validators into a single validator.
        </p>
      )}

      <Separator className="bg-border dark:bg-gray-800" />

      <div
        className="flex h-[52px] items-center justify-between hover:cursor-pointer"
        onClick={() => setOpenWhyConsolidate(!openWhyConsolidate)}
      >
        <p className="text-[13px] font-570 text-zinc-950 dark:text-zinc-50">
          Why should I consolidate?
        </p>
        <Button variant="ghost" size="icon">
          {openWhyConsolidate ? (
            <HiOutlineChevronUp />
          ) : (
            <HiOutlineChevronDown />
          )}
        </Button>
      </div>

      {openWhyConsolidate && (
        <p className="pb-4 text-[12px] leading-[14px] text-zinc-950 dark:text-zinc-50">
          Consolidating your validators allows you to take advantage of enhanced
          staking features.
        </p>
      )}

      <Separator className="bg-border dark:bg-gray-800" />

      <div
        className="flex h-[52px] items-center justify-between hover:cursor-pointer"
        onClick={() => setOpenNewFeatures(!openNewFeatures)}
      >
        <p className="text-[13px] font-570 text-zinc-950 dark:text-zinc-50">
          What new staking features does consolidating enable?
        </p>

        <Button variant="ghost" size="icon">
          {openNewFeatures ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}
        </Button>
      </div>

      {openNewFeatures && (
        <p className="break-words pb-4 text-[12px] leading-[14px] text-zinc-950 dark:text-zinc-50">
          Allows Ethereum validators to increase their maximum effective balance
          from 32 ETH to 2,048 ETH. This enhancement enables validators to
          combine multiple smaller stakes into a single larger one, simplifying
          management and reducing operational overhead. Additionally, it
          facilitates reward compounding, as higher balances accrue staking
          rewards more efficiently.
        </p>
      )}
    </div>
  );
};
