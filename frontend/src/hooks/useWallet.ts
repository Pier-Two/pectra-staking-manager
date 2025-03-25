import { useActiveAccount } from "thirdweb/react";
import { getWalletBalance } from "thirdweb/wallets";
import { client } from "pec/lib/wallet/client";
import { useQuery } from "@tanstack/react-query";

export const useWalletAddress = () => {
  const connectedAccount = useActiveAccount();
  return connectedAccount?.address ?? "";
};

export const useWalletBalance = () => {
  const connectedAccount = useActiveAccount();

  const fetchBalance = async () => {
    if (!connectedAccount?.address) return BigInt(0);

    const fetchedBalance = await getWalletBalance({
      address: connectedAccount.address,
      client,
      chain: {
        id: 1,
        name: "Ethereum",
        rpc: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID",
      },
    });

    return fetchedBalance.value;
  };

  const {
    data: balance = BigInt(0),
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
