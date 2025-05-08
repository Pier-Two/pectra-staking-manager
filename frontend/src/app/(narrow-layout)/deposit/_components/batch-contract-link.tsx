"use client";

import { HOODI_CHAIN_DETAILS } from "pec/constants/chain";
import { useActiveChainWithDefault } from "pec/hooks/useChain";
import { useContracts } from "pec/hooks/useContracts";

export const BatchContractLink = () => {
  const contracts = useContracts();
  const address = contracts.batchDeposit.address;

  const chain = useActiveChainWithDefault();

  const prefix = chain.id === HOODI_CHAIN_DETAILS.id ? "hoodi." : "";

  const url = `https://${prefix}etherscan.io/address/${address}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-indigo-500 dark:text-indigo-300"
    >
      Pier Two&apos;s batch deposit contract.
    </a>
  );
};
