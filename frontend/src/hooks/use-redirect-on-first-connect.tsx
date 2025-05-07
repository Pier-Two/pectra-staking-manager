"use client";

import {
  useActiveWalletConnectionStatus,
  useActiveAccount,
} from "thirdweb/react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import { useEffect } from "react";
import { create } from "zustand";

const useRedirectStore = create<{
  hasRedirected: boolean;
  setHasRedirected: (hasRedirected: boolean) => void;
}>((set) => ({
  hasRedirected: false,
  setHasRedirected: (hasRedirected) => set({ hasRedirected }),
}));

/**
 * Redirects to the validators-found page when the user first connects their wallet,
 * and to the dashboard page if they have already connected their wallet.
 */
export const useRedirectOnFirstConnect = () => {
  const [hasConnectedAddresses, setHasConnectedAddresses] = useLocalStorage(
    "hasConnectedAddresses",
    [] as string[],
  );

  const { hasRedirected, setHasRedirected } = useRedirectStore();

  const connectionStatus = useActiveWalletConnectionStatus();
  const account = useActiveAccount();

  const router = useRouter();

  useEffect(() => {
    if (hasRedirected) return;
    if (connectionStatus === "connected" && account?.address) {
      if (!hasConnectedAddresses.includes(account.address)) {
        setHasConnectedAddresses((old) => [...old, account.address]);
        setHasRedirected(true);
        router.push("/validators-found");
      } else {
        setHasRedirected(true);
        router.push("/dashboard");
      }
    }
  }, [
    account?.address,
    connectionStatus,
    hasConnectedAddresses,
    hasRedirected,
    router,
    setHasConnectedAddresses,
    setHasRedirected,
  ]);
};

/**
 * Client component version of the useRedirectOnFirstConnect hook.
 */
export const RedirectOnFirstConnect = () => {
  useRedirectOnFirstConnect();

  return null;
};
