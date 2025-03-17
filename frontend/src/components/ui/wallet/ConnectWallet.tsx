"use client";

import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client, wallets } from "pec/lib/wallet/client";
import type { StyleableComponent } from "pec/types/components";
import { clsx } from "clsx";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const ConnectWalletButton = ({ className }: StyleableComponent) => {
  const router = useRouter();
  const connectedAccount = useActiveAccount();

  useEffect(() => {
    if (connectedAccount) router.push("/validators-found");
  }, [connectedAccount, router]);

  return (
    <ConnectButton
      connectButton={{
        label: "Connect Wallet",
        className: clsx(
          "hover:bg-[#141019] hover:text-red-500 !w-full !max-w-md !bg-black dark:!bg-gray-200 !text-white dark:!text-black border-1-gray border-lg border-white",
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
