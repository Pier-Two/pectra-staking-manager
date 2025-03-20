"use client";

import { ConnectButton } from "thirdweb/react";
import { client, wallets } from "pec/lib/wallet/client";
import type { StyleableComponent } from "pec/types/components";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";

export const ConnectWalletButton = ({ className }: StyleableComponent) => {
  const router = useRouter();

  return (
    <ConnectButton
      connectButton={{
        label: "Connect Wallet",
        className: clsx(
          "!w-full !rounded-full !bg-indigo-500 !hover:bg-indigo-400 !text-white",
          className,
        ),
      }}
      autoConnect
      client={client}
      wallets={wallets}
      connectModal={{
        size: "wide",
        title: "Login/Sign up",
      }}
      onConnect={() => {
        router.push("/validators-found");
      }}
      onDisconnect={() => {
        router.push("/welcome");
      }}

      // auth={{
      //   isLoggedIn: async (address) => {
      //     console.log("checking if logged in!", { address });
      //     try {
      //       console.log("About to call isLoggedIn function");
      //       const result = await isLoggedIn();
      //       console.log("isLoggedIn function returned:", result);
      //       return result.isValid;
      //     } catch (error) {
      //       console.error("Error calling isLoggedIn:", error);
      //       return false;
      //     }
      //   },
      //   doLogin: async (params) => {
      //     console.log("logging in!");
      //     await login(params);
      //     // Invalidate the user query after login
      //     await queryClient.invalidateQueries({
      //       queryKey: [GetUserQueryKey],
      //     });
      //   },
      //   getLoginPayload: async ({ address }) => generatePayload({ address }),
      //   doLogout: async () => {
      //     console.log("logging out!");
      //     await logout();
      //     // Invalidate the user query after logout
      //     await queryClient.invalidateQueries({
      //       queryKey: [GetUserQueryKey],
      //     });
      //     router.push("/");
      //   },
      // }}
    />
  );
};
