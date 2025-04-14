import type { FC } from "react";
import { api } from "pec/trpc/react";
import { useWalletAddress } from "pec/hooks/useWallet";
import { UserModal } from "./UserModal";
import { UserType } from "pec/lib/api/schemas/database/user";

interface UserContainerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: UserType;
}

export const UserContainer = ({ open, setOpen, user }: UserContainerProps) => {
  return (
    <UserModal
      open={open}
      setOpen={setOpen}
      {...user.data}
      address={walletAddress}
    />
  );
};
