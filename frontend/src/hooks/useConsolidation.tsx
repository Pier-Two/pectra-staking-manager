"use client";

import { useActiveAccount } from "thirdweb/react";
import { useContracts } from "./useContracts";
import { eth_call, getRpcClient } from "thirdweb";
import { client } from "pec/lib/wallet/client";
import { holesky } from "pec/constants/contracts";

export const useConsolidation = () => {
  const account = useActiveAccount();

  const contracts = useContracts();

  // if (!contracts) {
  //   return null;
  // }

  // const fee = useReadContract({
  //   contract: contracts?.consolidation,
  //   method: "",
  //   params: [],
  //   queryOptions: {
  //     enabled: !!contracts,
  //   },
  // });

  console.log(account);

  const getConsolidationFee = async () => {
    if (!contracts) {
      throw new Error("Contracts not loaded");
    }

    const rpcRequest = getRpcClient({
      chain: holesky,
      client,
    });

    const result = await eth_call(rpcRequest, {
      to: contracts.consolidation.address,
      data: "0x",
    });

    console.log(result);
  };
  // import { createContractQuery } from "thirdweb/react";
  // import { totalSupply } from "thirdweb/extensions/erc20";
  // const { data, isLoading } = useTotalSupply({ contract });

  return {
    getConsolidationFee,
  };
};
