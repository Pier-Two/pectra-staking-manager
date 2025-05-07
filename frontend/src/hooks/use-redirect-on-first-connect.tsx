"use client";

import { useActiveWalletConnectionStatus } from "thirdweb/react";
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
  const [hasConnected, setHasConnected] = useLocalStorage(
    "hasConnected",
    false,
  );

  const { hasRedirected, setHasRedirected } = useRedirectStore();

  const connectionStatus = useActiveWalletConnectionStatus();
  const router = useRouter();

  useEffect(() => {
    if (hasRedirected) return;
    if (connectionStatus === "connected") {
      if (!hasConnected) {
        setHasConnected(true);
        setHasRedirected(true);
        router.push("/validators-found");
      } else {
        setHasRedirected(true);
        router.push("/dashboard");
      }
    }
  }, [
    connectionStatus,
    hasConnected,
    hasRedirected,
    router,
    setHasConnected,
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
