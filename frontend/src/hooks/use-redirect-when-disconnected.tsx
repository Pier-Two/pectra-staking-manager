"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActiveWalletConnectionStatus } from "thirdweb/react";

export const useRedirectWhenDisconnected = () => {
  const connectionStatus = useActiveWalletConnectionStatus();

  const router = useRouter();

  // watch for disconnection and redirect to welcome page
  useEffect(() => {
    if (connectionStatus === "disconnected") {
      router.push("/");
    }
  }, [connectionStatus, router]);
};

/**
 * Component that can be rendered in a server component to redirect to the welcome page
 * if the user is disconnected.
 */
export const RedirectWhenDisconnected = () => {
  useRedirectWhenDisconnected();

  return null;
};
