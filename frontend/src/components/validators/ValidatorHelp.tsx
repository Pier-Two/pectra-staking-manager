"use client";


import { type FC } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

const CustomAccordionContent = ({ text }: { text: string }) => {
  return (
    <AccordionContent>
      <p className="text-[12px] leading-[14px] text-zinc-950 dark:text-zinc-50">
        {text}
      </p>
    </AccordionContent>
  );
};

export const ValidatorHelp: FC = () => {
  return (    
    <Accordion type="single" collapsible className="w-full flex flex-col rounded-xl border border-zinc-200 bg-white px-4 text-left text-sm dark:border-gray-800 dark:bg-black">
      <AccordionItem value="what-is-validator-consolidation">
        <AccordionTrigger className="hover:no-underline">
          What is validator consolidation?
        </AccordionTrigger>
        <CustomAccordionContent text="Validator consolidation is the process of combining multiple validators into a single validator." />
      </AccordionItem>
      <AccordionItem value="why-should-i-consolidate">
        <AccordionTrigger className="hover:no-underline">
          Why should I consolidate?
        </AccordionTrigger>
          <CustomAccordionContent text="Consolidating your validators allows you to take advantage of enhanced staking features." />
      </AccordionItem>
      <AccordionItem value="what-new-staking-features-does-consolidating-enable" className="border-none">
        <AccordionTrigger className="hover:no-underline">
          What new staking features does consolidating enable?
        </AccordionTrigger>
        <CustomAccordionContent text="Allows Ethereum validators to increase their maximum effective balance from 32 ETH to 2,048 ETH. This enhancement enables validators to combine multiple smaller stakes into a single larger one, simplifying management and reducing operational overhead. Additionally, it facilitates reward compounding, as higher balances accrue staking rewards more efficiently." />
      </AccordionItem>
    </Accordion>
  );
};
