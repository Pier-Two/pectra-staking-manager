"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { HOODI_CHAIN_DETAILS } from "pec/constants/chain";
import { client } from "pec/lib/wallet/client";
import { api } from "pec/trpc/react";
import { TransactionStatus } from "pec/types/validator";
import { toast } from "sonner";
import { eth_call, waitForReceipt } from "thirdweb";
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
    setCurrentPubKey,
  } = useConsolidationStore();

  const { mutateAsync: saveConsolidationToDatabase } =
    api.validators.updateConsolidationRecord.useMutation();

  const consolidate = async () => {
    if (
      !consolidationTarget ||
      !validatorsToConsolidate ||
      !feeData ||
      !contracts ||
      !rpcClient ||
      !account
    ) {
      toast.error("There was an error consolidating", {
        description: "Please try again or double check input fields.",
      });
      return;
    }

    const results = [];

    const nonConsolidateHashes = validatorsToConsolidate.filter(
      (validator) => validator.consolidationTransaction === undefined,
    );

    for (const validator of nonConsolidateHashes) {
      try {
        setCurrentPubKey(validator.publicKey);

        // update the validator status to be in progress
        updateConsolidatedValidator(
          validator,
          undefined, // empty tx hash
          TransactionStatus.IN_PROGRESS,
        );

        const srcPubkey = validator.publicKey.replace(/^0x/g, "");
        const targetPubkey = consolidationTarget.publicKey.replace(/^0x/g, "");

        // Concatenate and add the 0x prefix back
        const callData = `0x${srcPubkey}${targetPubkey}`;

        // Call the consolidation contract with the fee
        const transaction = await account.sendTransaction({
          to: contracts.consolidation.address,
          value: feeData,
          data: callData as `0x${string}`,
          chainId: HOODI_CHAIN_DETAILS.id, // TODO make dynamic
        });

        // wait for the tx to be confirmed
        const tx = await waitForReceipt({
          chain: HOODI_CHAIN_DETAILS,
          client: client,
          transactionHash: transaction.transactionHash,
        });

        updateConsolidatedValidator(
          validator,
          tx.transactionHash,
          TransactionStatus.SUBMITTED,
        );

        await saveConsolidationToDatabase({
          targetValidatorIndex: consolidationTarget.validatorIndex,
          sourceTargetValidatorIndex: validator.validatorIndex,
          txHash: tx.transactionHash,
        });

        results.push({
          validator,
          txHash: tx.transactionHash,
          success: true,
        });
      } catch (error) {
        console.error(
          `Error consolidating validator ${validator.validatorIndex}:`,
          error,
        );
        updateConsolidatedValidator(
          validator,
          undefined,
          TransactionStatus.UPCOMING,
        );
        results.push({ validator, error, success: false });

        // break out of the loop if it errors
        setCurrentPubKey("");
        // TODO we should toast an error

        toast.error(
          `Error Consolidating Validator ${validator.validatorIndex}`,
          {
            description: "Please try again.",
          },
        );
        break;
      }

      setCurrentPubKey("");
    }

    return results;
  };

  const mutationFn = useMutation({
    mutationFn: consolidate,
    mutationKey: ["consolidate-function", consolidationTarget?.publicKey],
  });

  return mutationFn;
};
