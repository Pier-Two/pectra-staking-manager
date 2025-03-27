import { useActiveAccount } from "thirdweb/react";
import { getWalletBalance } from "thirdweb/wallets";
import { client } from "pec/lib/wallet/client";
import { useQuery } from "@tanstack/react-query";
import { useActiveChainWithDefault } from "./useChain";

export const useWalletAddress = () => {
  const connectedAccount = useActiveAccount();
  return connectedAccount?.address ?? "";
};

export const useWalletBalance = () => {
  const connectedAccount = useActiveAccount();
  const activeChain = useActiveChainWithDefault();
  const fetchBalance = async () => {
    if (!connectedAccount?.address) return BigInt(0);

    const fetchedBalance = await getWalletBalance({
      address: connectedAccount.address,
      client,
      chain: activeChain,
    });

    return fetchedBalance.value;
  };

  const {
    data: balance,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["walletBalance", connectedAccount?.address],
    queryFn: fetchBalance,
    enabled: !!connectedAccount?.address,
    retry: 2,
  });

  return {
    balance,
    loading,
    error: error ? "Failed to fetch balance" : null,
    refetch,
  };
};
