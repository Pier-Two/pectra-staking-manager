"use client";

import { useContracts } from "./useContracts";
import { eth_call } from "thirdweb";
import { useQuery } from "@tanstack/react-query";
import { useRpcClient } from "./useRpcClient";
import { fromHex, formatEther } from "viem";

export const useConsolidation = () => {
  const contracts = useContracts();
  const rpcClient = useRpcClient();

  const { data: consolidationFee } = useQuery({
    queryKey: ["consolidationFee"],
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

  return { consolidationFee };
};
