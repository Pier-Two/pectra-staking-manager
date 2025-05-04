"use client";

import { clsx } from "clsx";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { SUPPORTED_CHAINS } from "pec/constants/chain";
import { useWalletAddress } from "pec/hooks/useWallet";
import { client, wallets } from "pec/lib/wallet/client";
import type { StyleableComponent } from "pec/types/components";
import { useEffect, useState, useRef } from "react";
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

/**
 * Returns the shortest distance from a point to a rectangle.
 * If the point is inside the rectangle, returns 0.
 */
function distanceToRect(x: number, y: number, rect: DOMRect): number {
  const dx = Math.max(rect.left - x, 0, x - rect.right);
  const dy = Math.max(rect.top - y, 0, y - rect.bottom);
  return Math.sqrt(dx * dx + dy * dy);
}

export const ConnectWalletButton = ({
  className,
  text,
}: StyleableComponent & { text?: string }) => {
  const router = useRouter();
  const { resolvedTheme: theme } = useTheme();
  const address = useWalletAddress();
  const detailsModal = useWalletDetailsModal();
  const [isMounted, setIsMounted] = useState(false);
  const { data: ensName } = useEnsName({ client, address });
  const { data: ensAvatar } = useEnsAvatar({ client, ensName });
  const connectionStatus = useActiveWalletConnectionStatus();
  const buttonWrapperRef = useRef<HTMLDivElement>(null);
  const [isClung, setIsClung] = useState(false);

  // watch for disconnection and redirect to welcome page
  useEffect(() => {
    if (connectionStatus === "disconnected") {
      trackEvent("disconnect_wallet");
      router.push("/welcome");
    }
  }, [connectionStatus, router]);

  // This is to prevent the component from rendering on the server causing hydration errors from the dynamic theme styling
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const wrapper = buttonWrapperRef.current;
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const distance = distanceToRect(e.clientX, e.clientY, rect);

      // 4rem = 64px
      if (distance <= 64) {
        // Scale up to 1.15x as the mouse gets closer
        const scale = 1 + 0.15 * (1 - distance / 64);
        wrapper.style.transform = `scale(${scale})`;
      } else {
        wrapper.style.transform = "";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    function handleCling(e: CustomEvent<{ rect: DOMRect }>) {
      const wrapper = buttonWrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      // Compare rects to see if this is the clung button
      if (
        Math.abs(rect.left - e.detail.rect.left) < 1 &&
        Math.abs(rect.top - e.detail.rect.top) < 1 &&
        Math.abs(rect.width - e.detail.rect.width) < 1 &&
        Math.abs(rect.height - e.detail.rect.height) < 1
      ) {
        setIsClung(true);
      }
    }
    function handleUncling() {
      setIsClung(false);
    }
    window.addEventListener("cursor-cling", handleCling as EventListener);
    window.addEventListener("cursor-uncling", handleUncling);
    return () => {
      window.removeEventListener("cursor-cling", handleCling as EventListener);
      window.removeEventListener("cursor-uncling", handleUncling);
    };
  }, []);

  if (!isMounted)
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
    <div
      ref={buttonWrapperRef}
      className={clsx("connect-button-cursor-effect", { "scale-110": isClung })}
    >
      <ConnectButton
        connectButton={{
          label: text ?? "Connect Wallet",
          className: clsx(
            "!rounded-full !w-[420px] !max-w-[90vw] absorb-cursor !bg-primary !hover:bg-indigo-400 !text-white !text-xs !shadow-[0px_0px_20px_0px_white] dark:!shadow-[0px_0px_20px_0px_black] !px-4 !py-2 !h-10 !font-570 !leading[13px] !text-[13px] !px-4 dark:!bg-black w-[420px] max-w-[90%]",
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
        connectModal={{
          size: "wide",
          title: "Connect Wallet",
        }}
        onConnect={() => {
          trackEvent("connect_wallet");
          router.push("/validators-found");
        }}
      />
    </div>
  );
};
