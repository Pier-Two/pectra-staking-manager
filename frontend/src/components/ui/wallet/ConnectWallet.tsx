"use client";

import { ChevronDown } from "lucide-react";
import { SUPPORTED_CHAINS } from "pec/constants/chain";
import { useWalletAddress } from "pec/hooks/useWallet";
import { client, wallets } from "pec/lib/wallet/client";
import type { StyleableComponent } from "pec/types/components";
import { useEffect, useState } from "react";
import {
  ConnectButton,
  useEnsAvatar,
  useEnsName,
  useWalletDetailsModal,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import { Button } from "../button";
import { useTheme } from "next-themes";
import { trackEvent } from "pec/helpers/trackEvent";
import { PectraSpinner } from "../custom/pectraSpinner";
import { cn } from "pec/lib/utils";
import { ClingableElement } from "../clingable-element";
import { useRedirectStoreHydrated } from "pec/hooks/use-redirect-store";
import { usePathname, useRouter } from "next/navigation";
import { useIsMounted } from "usehooks-ts";

export const ConnectWalletButton = ({
  className,
  text,
}: StyleableComponent & { text?: string }) => {
  const { resolvedTheme: theme } = useTheme();
  const address = useWalletAddress();
  const detailsModal = useWalletDetailsModal();
  const { data: ensName } = useEnsName({ client, address });
  const { data: ensAvatar } = useEnsAvatar({ client, ensName });
  const connectionStatus = useActiveWalletConnectionStatus();
  const { hasConnectedAddresses, addConnectedAddress, isHydrated } =
    useRedirectStoreHydrated();
  const router = useRouter();
  const isMounted = useIsMounted();

  const [hasClicked, setHasClicked] = useState(false);
  const pathname = usePathname();
  // watch for disconnection and track event
  useEffect(() => {
    if (connectionStatus === "disconnected") {
      trackEvent("disconnect_wallet");
    }
  }, [connectionStatus]);

  if (!isMounted || !isHydrated)
    return (
      <Button
        disabled
        className="w-[123px] rounded-full border border-primary/30 bg-transparent dark:border-gray-700 dark:bg-gray-950"
        variant="outline"
      >
        <PectraSpinner />
      </Button>
    );

  return (
    <ClingableElement className="rounded-full">
      <ConnectButton
        connectButton={{
          label: text ?? "Connect Wallet",
          className: cn(
            "!rounded-full !w-[420px] !max-w-[90vw] absorb-cursor !bg-primary !hover:bg-indigo-400 !text-white !text-xs !shadow-[0px_0px_20px_0px_white] dark:!shadow-[0px_0px_20px_0px_black] !px-4 !py-2 !h-10 !font-570 !leading[13px] !text-[13px] !px-4 w-[420px] max-w-[90%]",
            className,
          ),
          style: {
            border: `1px solid ${theme === "dark" ? "#374151" : "transparent"}`,
          },
        }}
        theme={theme === "dark" ? "dark" : "light"}
        // Details Button ---- Using a custom Component because matching the mocked styling with className Prop is not possible
        detailsButton={{
          render: () => {
            return (
              <Button
                variant="ghost"
                className="h-10 rounded-full border border-primary/30 hover:bg-primary/10 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900"
                onClick={() => {
                  setHasClicked(true);
                  detailsModal.open({
                    client,
                    theme: theme === "dark" ? "dark" : "light",
                  });
                }}
              >
                {ensAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element -- Image comes from non-whitelisted url. Use img incase it can change
                  <img
                    src={ensAvatar}
                    alt="Avatar"
                    className="h-4 w-4 rounded-full"
                  />
                ) : (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-white">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                )}
                {ensName ?? `${address?.slice(0, 6)}...${address?.slice(-4)}`}
                <ChevronDown size={16} />
              </Button>
            );
          },
        }}
        autoConnect
        chains={SUPPORTED_CHAINS}
        client={client}
        wallets={wallets}
        showAllWallets={false}
        connectModal={{
          size: "wide",
          title: "Connect Wallet",
        }}
        onConnect={(wallet) => {
          trackEvent("connect_wallet");

          // only redirect if the user has explicitly clicked the connect button or is not on the charts page
          // this allows the charts page to load while connected without redirecting
          const shouldRedirect = hasClicked || pathname !== "/charts";

          if (shouldRedirect) {
            const address = wallet.getAccount()?.address;

            if (address && !hasConnectedAddresses.includes(address)) {
              addConnectedAddress(address);
              router.push("/validators-found");
            } else {
              router.push("/dashboard");
            }
          }
        }}
      />
    </ClingableElement>
  );
};
