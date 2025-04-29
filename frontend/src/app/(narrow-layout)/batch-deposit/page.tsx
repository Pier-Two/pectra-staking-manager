"use client";

import type { FC } from "react";
import BatchDepositLoading from "./loading";
import { useWalletAddress } from "pec/hooks/useWallet";
import { useActiveChainWithDefault } from "pec/hooks/useChain";
import { useWalletBalance } from "thirdweb/react";
import { client } from "pec/lib/wallet/client";
import { DepositWorkflow } from "pec/components/batch-deposits/DepositWorkflow";
import { useValidators } from "pec/hooks/useValidators";
import { formatEther } from "viem";

const BatchDeposit: FC = () => {
  const walletAddress = useWalletAddress();
  const chain = useActiveChainWithDefault();
  const {
    data: balance,
    isLoading,
    isError,
  } = useWalletBalance({
    chain,
    address: walletAddress || "",
    client,
  });

  const { isFetched, activeType2Validators } = useValidators();

  const componentLoading =
    !walletAddress || !chain || !balance || !isFetched || isLoading || isError;

  if (componentLoading) return <BatchDepositLoading />;

  return (
    <DepositWorkflow
      validators={activeType2Validators}
      balance={Number(formatEther(balance.value)) ?? 0}
    />
  );
};

export default BatchDeposit;
