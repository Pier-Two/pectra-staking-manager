"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { HOODI_CHAIN_DETAILS } from "pec/constants/chain";
import { eth_call } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { fromHex } from "viem";
import { useConsolidationStore } from "./use-consolidation-store";
import { useContracts } from "./useContracts";
import { useRpcClient } from "./useRpcClient";

export const useConsolidationFee = () => {
  const contracts = useContracts();
  const rpcClient = useRpcClient();

  const account = useActiveAccount();

  const queryFn = useQuery({
    queryKey: ["consolidationFee", account],
    queryFn: async () => {
      if (!contracts || !rpcClient) {
        throw new Error("Not loaded");
      }

      const result = await eth_call(rpcClient, {
        to: contracts.consolidation.address,
      });

      const convertedBigInt = fromHex(result, "bigint");

      return convertedBigInt;
    },
  });

  return queryFn;
};

export const useSubmitConsolidate = () => {
  const { data: feeData } = useConsolidationFee();
  const contracts = useContracts();
  const rpcClient = useRpcClient();
  const account = useActiveAccount();

  const {
    consolidationTarget,
    validatorsToConsolidate,
    updateConsolidatedValidator,
  } = useConsolidationStore();

  const consolidate = async () => {
    if (
      !consolidationTarget ||
      !validatorsToConsolidate ||
      !feeData ||
      !contracts ||
      !rpcClient ||
      !account
    ) {
      console.error("Missing required data for consolidation");
      return;
    }

    const results = [];

    const nonConsolidateHashes = validatorsToConsolidate.filter(
      (validator) => validator.consolidationTransaction === undefined,
    );

    for (const validator of nonConsolidateHashes) {
      try {
        // Combine source validator pubkey and target validator pubkey
        const callData =
          `0x${consolidationTarget.publicKey}${validator.publicKey}`.replace(
            /^0x0x/g,
            "0x",
          );

        // Call the consolidation contract with the fee
        const txHash = await account.sendTransaction({
          to: contracts.consolidation.address,
          value: feeData,
          data: callData as `0x${string}`,
          chainId: HOODI_CHAIN_DETAILS.id, // TODO make dynamic
        });

        updateConsolidatedValidator(validator, txHash.transactionHash);

        results.push({ validator, txHash, success: true });
      } catch (error) {
        console.error(
          `Error consolidating validator ${validator.validatorIndex}:`,
          error,
        );
        results.push({ validator, error, success: false });
      }
    }

    return results;
  };

  const mutationFn = useMutation({
    mutationFn: consolidate,
  });

  return mutationFn;
};
