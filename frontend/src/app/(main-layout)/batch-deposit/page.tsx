"use client";

import type { FC } from "react";
import BatchDepositLoading from "./loading";
import { useWalletAddress } from "pec/hooks/useWallet";
import { api } from "pec/trpc/react";
import { useActiveChainWithDefault } from "pec/hooks/useChain";
import { useWalletBalance } from "thirdweb/react";
import { client } from "pec/lib/wallet/client";
import { DepositWorkflow } from "pec/components/batch-deposits/DepositWorkflow";

const BatchDeposit: FC = () => {
  const walletAddress = useWalletAddress();
  const chain = useActiveChainWithDefault();
  const {
    data: xbalance,
    isLoading,
    isError,
  } = useWalletBalance({
    chain,
    address: walletAddress || "",
    client,
  });

  const balance = {
    value: 100,
  };

  const { data, isFetched } = api.validators.getValidators.useQuery(
    {
      address: walletAddress || "",
    },
    { enabled: !!walletAddress },
  );

  const componentLoading =
    !walletAddress ||
    !chain ||
    !balance ||
    !data ||
    !isFetched ||
    isLoading ||
    isError;
  if (componentLoading) return <BatchDepositLoading />;

  return <DepositWorkflow data={data} balance={Number(balance.value) ?? 0} />;
};

export default BatchDeposit;
