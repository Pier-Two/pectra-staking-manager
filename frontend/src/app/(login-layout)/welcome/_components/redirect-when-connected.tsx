"use client";

import { useRouter } from "next/navigation";
import { useActiveWalletConnectionStatus } from "thirdweb/react";

export const RedirectWhenConnected = () => {
  const connectionStatus = useActiveWalletConnectionStatus();
  const router = useRouter();

  if (connectionStatus === "connected") {
    router.push("/dashboard");
  }

  return null;
};
