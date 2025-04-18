import { useQuery } from "@tanstack/react-query";
import { useRpcClient } from "./useRpcClient";
import { useContracts } from "./useContracts";
import { eth_call, waitForReceipt } from "thirdweb";
import { encodePacked, fromHex, parseGwei } from "viem";
import { useActiveAccount } from "thirdweb/react";
import { api } from "pec/trpc/react";
import { type WithdrawalFormType } from "pec/lib/api/schemas/withdrawal";
import { toast } from "sonner";
import { useActiveChainWithDefault } from "./useChain";
import { parseError } from "pec/lib/utils/parseError";
import { useImmer } from "use-immer";
import type { TxHashRecord, WithdrawWorkflowStages } from "pec/types/withdraw";
import { client } from "pec/lib/wallet/client";

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
  const contracts = useContracts();
  const rpcClient = useRpcClient();
  const account = useActiveAccount();
  const chain = useActiveChainWithDefault();

  const { mutateAsync: saveWithdrawalToDatabase } =
    api.storeEmailRequest.storeWithdrawalRequest.useMutation();

  const submitWithdrawals = async (
    withdrawals: WithdrawalFormType["withdrawals"],
    email: string,
  ) => {
    if (!contracts || !rpcClient || !account || !withdrawalFee) {
      toast.error("There was an error withdrawing");
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

    const filteredWithdrawals = withdrawals.filter(
      (withdrawal) => withdrawal.amount > 0,
    );

    for (const withdrawal of filteredWithdrawals) {
      try {
        const callData = encodePacked(
          ["bytes", "uint64"],
          [
            withdrawal.validator.publicKey as `0x${string}`,
            parseGwei(withdrawal.amount.toString()),
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

        const result = await saveWithdrawalToDatabase({
          requestData: {
            validatorIndex: withdrawal.validator.validatorIndex,
            amount: withdrawal.amount,
            txHash: txHash.transactionHash,
            email,
          },
          network: chain.id,
        });

        if (!result.success) {
          toast.error("There was an error withdrawing", {
            description: result.error,
          });

          return;
        }

        toast.success("Withdrawal request submitted successfully");
      } catch (error) {
        toast.error("There was an error withdrawing", {
          description: parseError(error),
        });

        console.error(error);

        setStage({
          type: "data-capture",
        });

        return;
      }
    }

    for (const [validatorIndex, tx] of Object.entries(txHashes)) {
      if (tx.status !== "submitted") {
        console.error("Transaction in invalid state", tx);

        continue;
      }

      await waitForReceipt({
        transactionHash: tx.txHash,
        chain,
        client,
      });

      txHashes[Number(validatorIndex)] = {
        status: "finalised",
        txHash: tx.txHash,
      };

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
