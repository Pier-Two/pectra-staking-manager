"use client";

import { useWalletBalance } from "thirdweb/react";
import { formatEther } from "viem";

import { DepositWorkflow } from "pec/components/batch-deposits/DepositWorkflow";
import { useActiveChainWithDefault } from "pec/hooks/useChain";
import { useValidators } from "pec/hooks/useValidators";
import { useWalletAddress } from "pec/hooks/useWallet";
import { client } from "pec/lib/wallet/client";

import { BatchDepositLoading } from "./batch-deposit-loading";

/**
 * Wrapper for the deposit workflow so that the page can be a server component
 */
export const DepositWorkflowWrapper = () => {
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

  const { isSuccess, activeType2Validators: validators } = useValidators();

  const componentLoading =
    !walletAddress || !chain || !balance || !isSuccess || isLoading || isError;

  if (componentLoading) {
    return <BatchDepositLoading />;
  }

  return (
    <DepositWorkflow
      validators={validators}
      balance={Number(formatEther(balance?.value ?? BigInt(0)))}
    />
  );
};
