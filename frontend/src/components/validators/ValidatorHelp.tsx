"use client";

import { type FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const CustomAccordionContent = ({ text }: { text: string | JSX.Element }) => {
  return (
    <AccordionContent>
      {typeof text === "string" ? (
        <p className="text-sm text-zinc-950 dark:text-zinc-50">{text}</p>
      ) : (
        text
      )}
    </AccordionContent>
  );
};

type HelpItem = {
  id: string;
  question: string;
  answer: string | JSX.Element;
};

const helpItems: HelpItem[] = [
  {
    id: "auto-compounding-strategy",
    question: "How do I achieve an auto-compounding strategy?",
    answer:
      "In order to auto-compound your validator staking rewards, you need to upgrade your validator to a Pectra validator. Stake less than the 2048 ETH limit so that consensus layer rewards will auto-compound to your Pectra (0x02) validator. Any rewards above 2048 ETH will be automatically sent back to your withdrawal address.",
  },
  {
    id: "withdrawal-speed",
    question: "Will it be faster to withdraw when I upgrade?",
    answer:
      "You will certainly be able to partially withdraw your ETH faster. For example, if you have a 2048 ETH validator, withdrawing 2000 ETH from that will only take around 27 hours for the ETH to be back in your account if the queue is empty. Full exits will not change in time from the Pectra upgrade as they still have to be processed by the validator sweep clock. Read more here (Pier Two article).",
  },
  {
    id: "single-validator-consolidation",
    question: "Can I consolidate a single validator to upgrade to Pectra?",
    answer:
      "Yes you can consolidate a single validator into itself in order to upgrade it from 01 credential to an 0x02 credential. You will retain the same index and validator public key.",
  },
  {
    id: "consolidated-index",
    question: "What will my consolidated index be?",
    answer: (
      <p className="text-sm text-zinc-950 dark:text-zinc-50">
        If you have an early index number that you&apos;re looking to preserve.
        Users will be able to preserve the validator index of their favourite
        validator during consolidations, provided they have selected the public
        key or index value of the <span className="font-bold">target</span>{" "}
        validator as their favourite. Only the{" "}
        <span className="font-bold">source</span> validator (if it is different
        from <span className="font-bold">target</span>) will be exited from the
        Beacon chain. Have no fear, your OG index will be preserved.
      </p>
    ),
  },
  {
    id: "different-withdrawal-address",
    question:
      "Can I consolidate to a validator that is not connected to my withdrawal address?",
    answer:
      "Yes you can. This will be made clear in the following consolidation flow. Please ensure that you are consolidating to the right validator, as if you input the index or validator key incorrectly that you wish to be your target validator you will not get that ETH back.",
  },
  {
    id: "consolidate-pectra-validators",
    question:
      "Can I consolidate validators that have already been upgraded to Pectra validators?",
    answer:
      "Yes you can. For example if you have a validator with 100 ETH, you can consolidate it to a validator with 900 ETH for a new validator of 1000 ETH.",
  },
  {
    id: "security-and-cost",
    question: "Is this free to use and secure?",
    answer:
      "Yes! This app is purely to serve the Ethereum ecosystem and there are no beneficiaries of your actions other than you and the Ethereum Network. The app does not connect with your validator keys, only your withdrawal address and web3 wallet. The batch deposit contract for top-ups has been audited by Hashlock as well.",
  },
];

export const ValidatorHelp: FC = () => {
  return (
    <Accordion
      type="single"
      collapsible
      className="flex w-full flex-col rounded-xl border border-zinc-200 bg-white px-4 text-left text-sm dark:border-gray-800 dark:bg-black"
    >
      {helpItems.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className={
            item.id === helpItems[helpItems.length - 1]?.id
              ? "border-none"
              : "dark:border-gray-800"
          }
        >
          <AccordionTrigger className="text-left hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <CustomAccordionContent text={item.answer} />
        </AccordionItem>
      ))}
    </Accordion>
  );
};
