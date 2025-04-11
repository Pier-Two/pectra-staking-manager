"use client";

import type { FC } from "react";
import { api } from "pec/trpc/react";
import { useWalletAddress } from "pec/hooks/useWallet";
import { UserModal } from "./UserModal";

export const UserContainer: FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ open, setOpen }) => {
  const walletAddress = useWalletAddress();

  const { data: user, isFetched } = api.users.getUser.useQuery({
    address: walletAddress,
  });

  if (!!walletAddress || !user || !isFetched) return null;

  return (
    <UserModal
      open={open}
      setOpen={setOpen}
      address={walletAddress ?? ""}
      email={user.email ?? ""}
      firstName={user.firstName ?? ""}
      lastName={user.lastName ?? ""}
      companyName={user.companyName ?? ""}
    />
  );
};
