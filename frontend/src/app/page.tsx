"use client";

import { useRouter } from "next/navigation";
import { PectraSpinner } from "pec/components/ui/custom/pectraSpinner";
import { useEffect } from "react";
import { useActiveWalletConnectionStatus } from "thirdweb/react";

export default function Home() {
  const connectionStatus = useActiveWalletConnectionStatus();
  const router = useRouter();

  useEffect(() => {
    if (connectionStatus === "connected") {
      router.push("/dashboard");
    } else {
      router.push("/welcome");
    }
  }, [connectionStatus, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <PectraSpinner className="size-12" />
    </div>
  );
}
