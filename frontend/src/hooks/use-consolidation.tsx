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
import { parseError } from "pec/lib/utils/parseError";
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
    api.validators.updateConsolidationRecord.useMutation();

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

    // save upgrade tx to db
    const result = await saveConsolidationToDatabase({
      targetValidatorIndex: destination.validatorIndex,
      sourceTargetValidatorIndex: source.validatorIndex,
      txHash: upgradeTx.transactionHash,
      email,
    });

    if (!result.success) {
      toast({
        title: "Failed to save transaction",
        description: result.error,
        variant: "error",
      });
    }
  };

  const consolidate = async (
    destination: ValidatorDetails,
    rawTransactions: SubmittingConsolidationValidatorDetails[],
    updateTransactionStatus: (index: number, status: TransactionStatus) => void,
    email: string,
  ) => {
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
      return;
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
          title: "Error consolidating",
          description: parseError(error),
          variant: "error",
        });

        // TODO: What to do here?
        updateTransactionStatusWithLocalState(index, {
          status: "failedToSubmit",
          error: parseError(error),
        });
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

    // // if the user is consolidating to one of their own validators, and that validator is version
    // // 0x01, it must be updated to 0x02 first
    // if (
    //   !manuallySettingValidator &&
    //   destination.withdrawalAddress.startsWith("0x01") &&
    //   !destination.upgradeSubmitted // if they have already submitted an upgrade tx but API returns 0x01, we use our DB flag
    // ) {
    //   try {
    //     const upgradeTx = await consolidateValidator(
    //       contracts.consolidation.address,
    //       account,
    //       destination.publicKey,
    //       destination.publicKey,
    //       feeData,
    //       chain,
    //     );
    //
    //     // save upgrade tx to db
    //     await saveConsolidationToDatabase({
    //       targetValidatorIndex: destination.validatorIndex,
    //       sourceTargetValidatorIndex: destination.validatorIndex,
    //       txHash: upgradeTx.transactionHash,
    //       email: summaryEmail,
    //     });
    //
    //     toast({
    //       title: `Validator ${destination.validatorIndex} Upgraded`,
    //       description:
    //         "The transaction to update the validator version been submitted",
    //       variant: "success",
    //     });
    //   } catch (err) {
    //     console.error(`Error upgrading validator`, err);
    //
    //     toast({
    //       title: `Error Upgrading Validator ${destination.validatorIndex}`,
    //       description: "Please try again.",
    //       variant: "error",
    //     });
    //     return;
    //   }
    // }
    //
    // // this is the actual consolidation flow. First, it checks that the source validator is version 0x02. If it isn't,
    // // it submits an upgrade transaction first, before submitting the consolidation transaction
    // for (const validator of source) {
    //   try {
    //     setCurrentPubKey(validator.publicKey);
    //
    //     // if it's version 0x01 - submit the upgrade tx for this validator
    //     if (
    //       validator.withdrawalAddress.startsWith("0x01") &&
    //       !validator.upgradeSubmitted
    //     ) {
    //       const upgradeTx = await consolidateValidator(
    //         contracts.consolidation.address,
    //         account,
    //         validator.publicKey,
    //         validator.publicKey,
    //         feeData,
    //         chain,
    //       );
    //
    //       // save upgrade tx to db
    //       await saveConsolidationToDatabase({
    //         targetValidatorIndex: validator.validatorIndex,
    //         sourceTargetValidatorIndex: validator.validatorIndex,
    //         txHash: upgradeTx.transactionHash,
    //         email: summaryEmail,
    //       });
    //     }
    //
    //     // now the actual consolidation process can occur
    //
    //     // update the validator status to be in progress
    //     updateConsolidatedValidator(
    //       validator,
    //       undefined, // empty tx hash
    //       TransactionStatus.IN_PROGRESS,
    //     );
    //
    //     const consolidationTx = await consolidateValidator(
    //       contracts.consolidation.address,
    //       account,
    //       validator.publicKey,
    //       destination.publicKey,
    //       feeData,
    //       chain,
    //     );
    //
    //     updateConsolidatedValidator(
    //       validator,
    //       consolidationTx.transactionHash,
    //       TransactionStatus.SUBMITTED,
    //     );
    //
    //     await saveConsolidationToDatabase({
    //       targetValidatorIndex: destination.validatorIndex,
    //       sourceTargetValidatorIndex: validator.validatorIndex,
    //       txHash: consolidationTx.transactionHash,
    //       email: summaryEmail,
    //     });
    //
    //     results.push({
    //       validator,
    //       txHash: consolidationTx.transactionHash,
    //       success: true,
    //     });
    //   } catch (error) {
    //     console.error(
    //       `Error consolidating validator ${validator.validatorIndex}:`,
    //       error,
    //     );
    //     updateConsolidatedValidator(
    //       validator,
    //       undefined,
    //       TransactionStatus.UPCOMING,
    //     );
    //     results.push({ validator, error, success: false });
    //
    //     // break out of the loop if it errors
    //     setCurrentPubKey("");
    //
    //     toast({
    //       title: `Error Consolidating Validator ${validator.validatorIndex}`,
    //       description: "Please try again.",
    //       variant: "error",
    //     });
    //     break;
    //   }
    //
    //   setCurrentPubKey("");
    // }

    return [];
  };

  return consolidate;
};
