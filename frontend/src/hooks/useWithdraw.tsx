import { useQuery } from "@tanstack/react-query";
import { useRpcClient } from "./useRpcClient";
import { useContracts } from "./useContracts";
import { eth_call } from "thirdweb";

export const useWithdraw = () => {
  const rpcClient = useRpcClient();
  const contracts = useContracts();

  const { data: withdrawalFee } = useQuery({
    queryKey: ["withdrawalFee", rpcClient, contracts],
    queryFn: async () => {
      if (!contracts || !rpcClient) {
        throw new Error("Not loaded");
      }

      const result = await eth_call(rpcClient, {
        to: contracts.withdrawal.address,
      });

      return result;
    },
  });

  return { withdrawalFee };
};
