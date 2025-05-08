import { useQuery } from "@tanstack/react-query";
import { toast } from "pec/components/ui/Toast";
import { type FormWithdrawalType } from "pec/lib/api/schemas/withdrawal";
import { client } from "pec/lib/wallet/client";
import { api } from "pec/trpc/react";
import type { TxHashRecord, WithdrawWorkflowStages } from "pec/types/withdraw";
import { eth_call, waitForReceipt } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { useImmer } from "use-immer";
import { encodePacked, fromHex, parseGwei } from "viem";
import { useActiveChainWithDefault } from "./useChain";
import { useContracts } from "./useContracts";
import { useRpcClient } from "./useRpcClient";
import { trackEvent } from "pec/helpers/trackEvent";
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export const useWithdraw = () => {
  const rpcClient = useRpcClient();
  const contracts = useContracts();

  const queryFn = useQuery({
    queryKey: ["withdrawalFee", rpcClient, contracts],
    queryFn: async () => {
      if (!contracts || !rpcClient) {
        throw new Error("Not loaded");
      }

      const result = await eth_call(rpcClient, {
        to: contracts.withdrawal.address,
      });

      return fromHex(result, "bigint");
    },
  });

  return queryFn;
};

export const useSubmitWithdraw = () => {
  const { data: withdrawalFee } = useWithdraw();
  const [stage, setStage] = useImmer<WithdrawWorkflowStages>({
    type: "data-capture",
  });

  // track stage
  useEffect(() => {
    trackEvent(`withdraw_stage_changed`, {
      stage: stage.type,
    });
  }, [stage]);

  const contracts = useContracts();
  const rpcClient = useRpcClient();
  const account = useActiveAccount();
  const chain = useActiveChainWithDefault();

  const { mutateAsync: saveWithdrawalToDatabase } =
    api.storeFlowCompletion.storeWithdrawalRequest.useMutation();

  const submitWithdrawals = async (
    withdrawals: FormWithdrawalType["withdrawals"],
    email: string,
  ) => {
    if (!contracts || !rpcClient || !account || !withdrawalFee) {
      toast({
        title: "Error withdrawing",
        description: "There was an error withdrawing",
        variant: "error",
      });
      return;
    }

    // We mutate this object in place throughout this hook
    // It looks a bit illegal but its perfectly fine and saves a heap of useState reads
    // We use immer here so that it re-renders when the object contents change instead of the usual re-render when the entire object changes
    const txHashes: TxHashRecord = {};
    for (const withdrawal of withdrawals) {
      txHashes[withdrawal.validator.validatorIndex] = {
        status: "pending",
      };
    }

    // We jump to this state because there is multiple signings
    setStage({ type: "sign-submit-finalise", txHashes });

    // TODO: Integrate exits here, reemove this check
    const filteredWithdrawals = withdrawals.filter(
      (withdrawal) => withdrawal.amount > 0,
    );

    for (const withdrawal of filteredWithdrawals) {
      try {
        const callData = encodePacked(
          ["bytes", "uint64"],
          [
            withdrawal.validator.publicKey as `0x${string}`,
            parseGwei(
              withdrawal.amount === withdrawal.validator.balance
                ? "0"
                : withdrawal.amount.toString(),
            ),
          ],
        );

        txHashes[withdrawal.validator.validatorIndex] = {
          status: "signing",
        };

        setStage({
          type: "sign-submit-finalise",
          txHashes,
        });

        const txHash = await account.sendTransaction({
          to: contracts.withdrawal.address,
          value: withdrawalFee,
          data: callData,
          chainId: chain.id,
        });

        txHashes[withdrawal.validator.validatorIndex] = {
          status: "submitted",
          txHash: txHash.transactionHash,
        };

        setStage({
          type: "sign-submit-finalise",
          txHashes,
        });

        // Emails get their own try-catch, because they are non-critical errors that we are kinda ignoring so the flow doesn't break for the user
        try {
          await saveWithdrawalToDatabase({
            validatorIndex: withdrawal.validator.validatorIndex,
            balance: withdrawal.validator.balance,
            amount: withdrawal.amount,
            txHash: txHash.transactionHash,
            email,
            network: chain.id,
            withdrawalAddress: account.address,
          });
        } catch (e) {
          console.error("Error saving withdrawal to database", e);
          toast({
            title:
              "Error saving withdrawal to database, emails may not be sent",
            variant: "error",
          });
          Sentry.captureException(e);
          continue;
        }

        toast({
          title: "Success",
          description: "Withdrawal request submitted successfully",
          variant: "success",
        });

        // track event
        trackEvent("withdrawal_submitted", {
          validatorIndex: withdrawal.validator.validatorIndex,
          amount: withdrawal.amount,
        });

        if (email) {
          trackEvent("withdrawal_email_submitted");
        }
      } catch (error) {
        toast({
          title: "User cancelled",
          description: "Please update selections and continue",
          variant: "error",
        });

        setStage({
          type: "data-capture",
        });

        return;
      }
    }

    for (const [validatorIndex, tx] of Object.entries(txHashes)) {
      if (tx.status === "failedToSubmit") continue;
      if (tx.status !== "submitted") {
        console.error("Transaction in invalid state", tx);

        continue;
      }

      const receipt = await waitForReceipt({
        transactionHash: tx.txHash,
        chain,
        client,
      });

      if (receipt.status === "success") {
        // If the transaction was successful
        txHashes[Number(validatorIndex)] = {
          status: "finalised",
          txHash: receipt.transactionHash,
        };
      } else {
        // If the transaction failed
        txHashes[Number(validatorIndex)] = {
          status: "failed",
          txHash: tx.txHash,
        };
      }

      setStage({
        type: "sign-submit-finalise",
        txHashes,
      });
    }
  };

  return {
    submitWithdrawals,
    stage,
    setStage,
  };
};
