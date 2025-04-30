"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "pec/components/ui/Toast";
import { api } from "pec/trpc/react";
import { ValidatorDetails } from "pec/types/validator";
import { eth_call, waitForReceipt } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { type Account } from "thirdweb/wallets";
import { fromHex } from "viem";
import { useActiveChainWithDefault } from "./useChain";
import { useContracts } from "./useContracts";
import { useRpcClient } from "./useRpcClient";
import { SubmittingConsolidationValidatorDetails } from "pec/constants/columnHeaders";
import { TransactionStatus } from "pec/types/withdraw";
import { client } from "pec/lib/wallet/client";
import { cloneDeep } from "lodash";

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
  const account = useActiveAccount();
  const chain = useActiveChainWithDefault();

  const { mutateAsync: saveConsolidationToDatabase } =
    api.storeEmailRequest.storeConsolidationRequest.useMutation();

  const sendConsolidationAndSaveToDatabase = async (
    updateTransactionStatus: (index: number, status: TransactionStatus) => void,
    index: number,
    destination: ValidatorDetails,
    source: ValidatorDetails,
    account: Account,
    feeData: bigint,
    email: string,
  ): Promise<void> => {
    const srcAddressWithoutLeading = source.publicKey.slice(2);
    const targetAddressWithoutLeading = destination.publicKey.slice(2);

    // Concatenate and add the 0x prefix
    const callData = `0x${srcAddressWithoutLeading}${targetAddressWithoutLeading}`;

    // Call the consolidation contract with the fee
    const upgradeTx = await account.sendTransaction({
      to: contracts.consolidation.address,
      value: feeData,
      data: callData as `0x${string}`,
      chainId: chain.id,
    });

    updateTransactionStatus(index, {
      status: "submitted",
      txHash: upgradeTx.transactionHash,
    });

    // Emails get their own try-catch, because they are non-critical errors that we are kinda ignoring so the flow doesn't break for the user
    try {
      await saveConsolidationToDatabase({
        targetValidatorIndex: destination.validatorIndex,
        sourceTargetValidatorIndex: source.validatorIndex,
        txHash: upgradeTx.transactionHash,
        email,
        network: chain.id,
      });
    } catch (e) {
      console.error("Error saving consolidation to database:", e);
      toast({
        title: "Error saving consolidation to database, emails may not be sent",
        variant: "error",
      });
    }
  };

  const consolidate = async (
    destination: ValidatorDetails,
    rawTransactions: SubmittingConsolidationValidatorDetails[],
    updateTransactionStatus: (index: number, status: TransactionStatus) => void,
    email: string,
  ): Promise<boolean> => {
    const transactions = cloneDeep(rawTransactions);

    // This method just ensures the local transactions object stays in sync with the state
    const updateTransactionStatusWithLocalState = (
      index: number,
      status: TransactionStatus,
    ) => {
      updateTransactionStatus(index, status);
      transactions[index]!.transactionStatus = status;
    };

    if (!feeData || !account) {
      toast({
        title: "Error consolidating",
        description: "Please try again or double check input fields.",
        variant: "error",
      });
      return false;
    }

    for (const [index, validatorConsolidationTx] of transactions.entries()) {
      updateTransactionStatusWithLocalState(index, { status: "signing" });

      try {
        if (validatorConsolidationTx.consolidationType === "upgrade") {
          await sendConsolidationAndSaveToDatabase(
            updateTransactionStatusWithLocalState,
            index,
            validatorConsolidationTx,
            validatorConsolidationTx,
            account,
            feeData,
            email,
          );
        } else {
          await sendConsolidationAndSaveToDatabase(
            updateTransactionStatusWithLocalState,
            index,
            destination,
            validatorConsolidationTx,
            account,
            feeData,
            email,
          );
        }
      } catch (error) {
        toast({
          title: "User cancelled",
          description: "Please update selections and continue",
          variant: "error",
        });

        return false;
      }
    }

    for (const [index, validator] of transactions.entries()) {
      if (validator.transactionStatus.status === "failedToSubmit") continue;
      if (validator.transactionStatus.status !== "submitted") {
        console.error("Transaction in invalid state", validator);

        continue;
      }

      const receipt = await waitForReceipt({
        transactionHash: validator.transactionStatus.txHash,
        chain,
        client,
      });

      if (receipt.status === "success") {
        updateTransactionStatusWithLocalState(index, {
          status: "finalised",
          txHash: receipt.transactionHash,
        });
      } else {
        updateTransactionStatusWithLocalState(index, {
          status: "failed",
          txHash: validator.transactionStatus.txHash,
        });
      }
    }

    return true;
  };

  return consolidate;
};
