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
import { useState } from "react";
import { TxHashRecord, WithdrawWorkflowStages } from "pec/types/withdraw";
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
  const [stage, setStage] = useState<WithdrawWorkflowStages>({
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
  ) => {
    if (!contracts || !rpcClient || !account || !withdrawalFee) {
      toast.error("There was an error withdrawing");

      return;
    }

    const txHashes: TxHashRecord = {};

    // We jump to this state because there is multiple signings
    setStage({ type: "transactions-submitted", txHashes });

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

        const txHash = await account.sendTransaction({
          to: contracts.withdrawal.address,
          value: withdrawalFee,
          data: callData,
          chainId: chain.id,
        });

        txHashes[withdrawal.validator.validatorIndex] = {
          txHash: txHash.transactionHash,
          isFinalised: false,
        };

        setStage({
          type: "transactions-submitted",
          txHashes,
        });

        const result = await saveWithdrawalToDatabase({
          requestData: {
            validatorIndex: withdrawal.validator.validatorIndex,
            amount: withdrawal.amount,
            txHash: txHash.transactionHash,
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

    for (const [validatorIndex, { txHash }] of Object.entries(txHashes)) {
      const receipt = await waitForReceipt({
        transactionHash: txHash,
        chain,
        client,
      });

      txHashes[Number(validatorIndex)] = {
        txHash: receipt.transactionHash,
        isFinalised: true,
      };

      setStage({
        type: "transactions-submitted",
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
