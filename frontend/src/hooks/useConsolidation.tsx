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
      if (!contracts || !rpcClient) {
        throw new Error("Not loaded");
      }

      const result = await eth_call(rpcClient, {
        to: contracts.consolidation.address,
      });

      const convertedBigInt = fromHex(result, "bigint");

      return Number(formatEther(convertedBigInt));
    },
  });

  return queryFn;
};

export const useConsolidation = () => {
  const { data: feeData } = useConsolidationFee();

  const consolidate = async () => {
    // TODO add call to consolidate contract
  };

  const mutationFn = useMutation({
    mutationFn: consolidate,
  });

  return mutationFn;
};
