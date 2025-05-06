"use client";

import { useActiveWalletConnectionStatus } from "thirdweb/react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import { useEffect } from "react";

/**
 * Redirects to the validators-found page when the user first connects their wallet.
 */
export const useRedirectOnFirstConnect = () => {
  const [hasConnected, setHasConnected] = useLocalStorage(
    "hasConnected",
    false,
  );

  const connectionStatus = useActiveWalletConnectionStatus();
  const router = useRouter();

  useEffect(() => {
    if (connectionStatus === "connected" && !hasConnected) {
      setHasConnected(true);
      router.push("/validators-found");
    }
  }, [connectionStatus, hasConnected, router, setHasConnected]);
};

/**
 * Client component version of the useRedirectOnFirstConnect hook.
 */
export const RedirectOnFirstConnect = () => {
  useRedirectOnFirstConnect();

  return null;
};
