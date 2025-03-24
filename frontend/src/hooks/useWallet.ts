import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { getWalletBalance } from "thirdweb/wallets";
import { client } from "pec/lib/wallet/client";

export const useWalletAddress = () => {
  const connectedAccount = useActiveAccount();
  return connectedAccount?.address ?? "";
};

export const useWalletBalance = () => {
  const connectedAccount = useActiveAccount();
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!connectedAccount?.address) return;

      setLoading(true);
      setError(null);

      try {
        const fetchedBalance = await getWalletBalance({
          address: connectedAccount.address,
          client,
          chain: {
            id: 1,
            name: "Ethereum",
            rpc: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID",
          },
        });

        setBalance(fetchedBalance.value);
      } catch (err) {
        setError("Failed to fetch balance");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    void fetchBalance();
  }, [connectedAccount?.address]);

  return {
    balance,
    loading,
    error,
  };
};
