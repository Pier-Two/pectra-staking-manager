import { useQuery } from "@tanstack/react-query";
import { useRpcClient } from "./useRpcClient";
import { useContracts } from "./useContracts";
import { eth_call } from "thirdweb";
import { fromHex, parseGwei } from "viem";
import { useActiveAccount } from "thirdweb/react";
import { api } from "pec/trpc/react";
import { type WithdrawalFormType } from "pec/lib/api/schemas/withdrawal";
import { toast } from "sonner";
import { useActiveChainWithDefault } from "./useChain";
import { parseError } from "pec/lib/utils/parseError";
import { useState } from "react";
import { WithdrawWorkflowStages } from "pec/types/withdraw";
import { convertToLittleEndianUint64Hex } from "pec/lib/utils/bytes";

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

    const txHashes: Record<number, string> = {};

    // We jump to this state because there is multiple signings
    setStage({ type: "transactions-submitted", txHashes });

    const filteredWithdrawals = withdrawals.filter(
      (withdrawal) => withdrawal.amount > 0,
    );

    for (const withdrawal of filteredWithdrawals) {
      try {
        const amount = convertToLittleEndianUint64Hex(
          parseGwei(withdrawal.amount.toString()),
        );

        const callData =
          `0x${withdrawal.validator.publicKey.slice(2)}${amount.slice(2)}` as `0x${string}`;

        const txHash = await account.sendTransaction({
          to: contracts.withdrawal.address,
          value: withdrawalFee,
          data: callData,
          chainId: chain.id,
        });

        txHashes[withdrawal.validator.validatorIndex] = txHash.transactionHash;

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

    setStage({
      type: "transactions-finalised",
      txHashes,
    });
  };

  return {
    submitWithdrawals,
    stage,
    setStage,
  };
};
