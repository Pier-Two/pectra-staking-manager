import { useActiveAccount } from "thirdweb/react";

export const useWalletAddress = () => {
  const connectedAccount = useActiveAccount();
  return connectedAccount?.address ?? "";
};
