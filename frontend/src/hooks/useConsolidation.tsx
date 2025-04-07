"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { eth_call } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { formatEther, fromHex } from "viem";
import { useContracts } from "./useContracts";
import { useRpcClient } from "./useRpcClient";

export const useConsolidationFee = () => {
  const contracts = useContracts();
  const rpcClient = useRpcClient();

  const account = useActiveAccount();

  const queryFn = useQuery({
    queryKey: ["consolidationFee", account],
    queryFn: async () => {
      console.log("hello");
      if (!contracts || !rpcClient) {
        throw new Error("Not loaded");
      }

      console.log("pre hook");
      const result = await eth_call(rpcClient, {
        to: contracts.consolidation.address,
      });

      console.log("result: ", result);

      const convertedBigInt = fromHex(result, "bigint");

      console.log(convertedBigInt);
      return Number(formatEther(convertedBigInt));
    },
  });

  return queryFn;
};

export const useConsolidation = () => {
  const { data: feeData } = useConsolidationFee();

  const mutationFn = useMutation({
    mutationFn: async () => {
      console.log("clicked consolidate");
    },
  });

  return mutationFn;
};
