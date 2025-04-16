import { useMutation, useQuery } from "@tanstack/react-query";
import { useRpcClient } from "./useRpcClient";
import { useContracts } from "./useContracts";
import { eth_call } from "thirdweb";
import { fromHex, encodePacked, parseEther } from "viem";
import { useActiveAccount } from "thirdweb/react";
import { api } from "pec/trpc/react";
import { type WithdrawalFormType } from "pec/lib/api/schemas/withdrawal";
import { toast } from "sonner";
import { useActiveChainWithDefault } from "./useChain";
import { parseError } from "pec/lib/utils/parseError";

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

    const filteredWithdrawals = withdrawals.filter(
      (withdrawal) => withdrawal.amount > 0,
    );

    for (const withdrawal of filteredWithdrawals) {
      try {
        // Encode the data using viem's encodePacked equivalent
        const callData = encodePacked(
          ["bytes", "uint256"],
          [
            withdrawal.validator.publicKey as `0x{string}`,
            parseEther(withdrawal.amount.toString()),
          ],
        );

        const txHash = await account.sendTransaction({
          to: contracts.consolidation.address,
          value: withdrawalFee,
          data: callData,
          chainId: chain.id,
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
        } else {
          toast.success("Withdrawal request submitted successfully");
        }
      } catch (error) {
        toast.error("There was an error withdrawing", {
          description: parseError(error),
        });

        console.error(error);

        // Rethrow error so the mutation function can handle it
        throw error;
      }
    }
  };

  const mutationFn = useMutation({
    mutationFn: submitWithdrawals,
    mutationKey: ["withdrawals"],
  });

  return {
    submitWithdrawalsMutationFn: mutationFn,
  };
};
