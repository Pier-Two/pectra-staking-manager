"use client";

import { SUPPORTED_NETWORKS_IDS } from "pec/constants/chain";
import { useActiveChainWithDefault } from "pec/hooks/useChain";
import type { ParentComponent } from "pec/types/components";
import { ThirdwebProvider } from "thirdweb/react";

export const NetworkContextProvider = ({ children }: ParentComponent) => {
  return (
    <ThirdwebProvider>
      <NetworkSwitcher>{children}</NetworkSwitcher>
    </ThirdwebProvider>
  );
};

const NetworkSwitcher = ({ children }: ParentComponent) => {
  const network = useActiveChainWithDefault();

  if (SUPPORTED_NETWORKS_IDS.includes(network.id)) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-center text-2xl font-bold">Unsupported Network</h1>
      <p className="text-center text-lg">
        Please connect to one of the supported networks.
      </p>
    </div>
  );
};
