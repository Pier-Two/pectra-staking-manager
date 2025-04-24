"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "pec/components/ui/Toast";
import { client } from "pec/lib/wallet/client";
import { api } from "pec/trpc/react";
import { TransactionStatus } from "pec/types/validator";
import { eth_call, waitForReceipt } from "thirdweb";
import type { ChainOptions } from "thirdweb/chains";
import { useActiveAccount } from "thirdweb/react";
import { type Account } from "thirdweb/wallets";
import { fromHex } from "viem";
import { useConsolidationStore } from "./use-consolidation-store";
import { useActiveChainWithDefault } from "./useChain";
import { useContracts } from "./useContracts";
import { useRpcClient } from "./useRpcClient";

// helper function that is called within the useSubmitConsolidate() hook
const consolidateValidator = async (
  consolidationContractAddress: string, // TODO this shouldn't have to be an arg
  account: Account,
  srcAddress: string,
  targetAddress: string,
  feeData: bigint,
  chain: Readonly<
    ChainOptions & {
      rpc: string;
    }
  >,
) => {
  const srcAddressWithoutLeading = srcAddress.slice(2);
  const targetAddressWithoutLeading = targetAddress.slice(2);

  // Concatenate and add the 0x prefix
  const callData = `0x${srcAddressWithoutLeading}${targetAddressWithoutLeading}`;

  // Call the consolidation contract with the fee
  const upgradeTransaction = await account.sendTransaction({
    to: consolidationContractAddress,
    value: feeData,
    data: callData as `0x${string}`,
    chainId: chain.id,
  });

  // wait for the tx to be confirmed
  const upgradeTx = await waitForReceipt({
    chain,
    client: client,
    transactionHash: upgradeTransaction.transactionHash,
  });

  return upgradeTx;
};

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
  const chain = useActiveChainWithDefault();

  const {
    consolidationTarget,
    validatorsToConsolidate,
    updateConsolidatedValidator,
    setCurrentPubKey,
    manuallySettingValidator,
    summaryEmail,
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
      toast({
        title: "Error consolidating",
        description: "Please try again or double check input fields.",
        variant: "error",
      });
      return;
    }

    const results = [];

    const filteredValidatorsForConsolidation = validatorsToConsolidate.filter(
      (validator) =>
        validator.consolidationTransaction === undefined &&
        !validator.hasPendingDeposit,
    );

    // if the user is consolidating to one of their own validators, and that validator is version
    // 0x01, it must be updated to 0x02 first
    if (
      !manuallySettingValidator &&
      consolidationTarget.withdrawalAddress.startsWith("0x01") &&
      !consolidationTarget.upgradeSubmitted // if they have already submitted an upgrade tx but API returns 0x01, we use our DB flag
    ) {
      try {
        const upgradeTx = await consolidateValidator(
          contracts.consolidation.address,
          account,
          consolidationTarget.publicKey,
          consolidationTarget.publicKey,
          feeData,
          chain,
        );

        // save upgrade tx to db
        await saveConsolidationToDatabase({
          targetValidatorIndex: consolidationTarget.validatorIndex,
          sourceTargetValidatorIndex: consolidationTarget.validatorIndex,
          txHash: upgradeTx.transactionHash,
          email: summaryEmail,
        });

        toast({
          title: `Validator ${consolidationTarget.validatorIndex} Upgraded`,
          description:
            "The transaction to update the validator version been submitted",
          variant: "success",
        });
      } catch (err) {
        console.error(`Error upgrading validator`, err);

        toast({
          title: `Error Upgrading Validator ${consolidationTarget.validatorIndex}`,
          description: "Please try again.",
          variant: "error",
        });
        return;
      }
    }

    // this is the actual consolidation flow. First, it checks that the source validator is version 0x02. If it isn't,
    // it submits an upgrade transaction first, before submitting the consolidation transaction
    for (const validator of filteredValidatorsForConsolidation) {
      try {
        setCurrentPubKey(validator.publicKey);

        // if it's version 0x01 - submit the upgrade tx for this validator
        if (
          validator.withdrawalAddress.startsWith("0x01") &&
          !validator.upgradeSubmitted
        ) {
          const upgradeTx = await consolidateValidator(
            contracts.consolidation.address,
            account,
            validator.publicKey,
            validator.publicKey,
            feeData,
            chain,
          );

          // save upgrade tx to db
          await saveConsolidationToDatabase({
            targetValidatorIndex: validator.validatorIndex,
            sourceTargetValidatorIndex: validator.validatorIndex,
            txHash: upgradeTx.transactionHash,
            email: summaryEmail,
          });
        }

        // now the actual consolidation process can occur

        // update the validator status to be in progress
        updateConsolidatedValidator(
          validator,
          undefined, // empty tx hash
          TransactionStatus.IN_PROGRESS,
        );

        const consolidationTx = await consolidateValidator(
          contracts.consolidation.address,
          account,
          validator.publicKey,
          consolidationTarget.publicKey,
          feeData,
          chain,
        );

        updateConsolidatedValidator(
          validator,
          consolidationTx.transactionHash,
          TransactionStatus.SUBMITTED,
        );

        await saveConsolidationToDatabase({
          targetValidatorIndex: consolidationTarget.validatorIndex,
          sourceTargetValidatorIndex: validator.validatorIndex,
          txHash: consolidationTx.transactionHash,
          email: summaryEmail,
        });

        results.push({
          validator,
          txHash: consolidationTx.transactionHash,
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

        toast({
          title: `Error Consolidating Validator ${validator.validatorIndex}`,
          description: "Please try again.",
          variant: "error",
        });
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
