import { DepositData } from "pec/lib/api/schemas/deposit";
import { useContracts } from "./useContracts";
import { api } from "pec/trpc/react";
import { useMutation } from "@tanstack/react-query";
import { prepareContractCall, sendTransaction } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { toast } from "sonner";
import { parseEther } from "viem";

interface BatchDepositRequest {
  pubKey: `0x${string}`;
  amount: bigint;
  signature: `0x${string}`;
  withdrawalCredentials: `0x${string}`;
}

export const useBatchDeposit = () => {
  const { batchDeposit } = useContracts();
  const account = useActiveAccount();

  const { mutateAsync: saveWithdrawalToDatabase } =
    api.storeEmailRequest.storeDepositRequest.useMutation();

  const submitBatchDeposit = async (
    deposits: DepositData[],
    email?: string,
  ) => {
    if (!account) {
      toast.error("There was an error depositing");

      return;
    }

    const formattedDeposits: BatchDepositRequest[] = deposits.map(
      (deposit) => ({
        pubKey: deposit.validator.publicKey as `0x${string}`,
        amount: parseEther(deposit.amount.toString()),
        // TODO:
        signature: "0x" as `0x${string}`,
        withdrawalCredentials: account.address as `0x${string}`,
      }),
    );

    const receipt = await sendTransaction({
      account,
      transaction: prepareContractCall({
        contract: batchDeposit,
        method: "batchDeposit",
        params: [formattedDeposits],
      }),
    });

    const saveWithdrawalDetails = deposits.map((deposit) => ({
      validatorIndex: deposit.validator.validatorIndex,
      txHash: receipt.transactionHash,
      email: email,
    }));

    const result = await saveWithdrawalToDatabase(saveWithdrawalDetails);

    if (!result.success) {
      toast.error("There was an error saving the deposit to the database");
    } else {
      toast.success("Deposits saved successfully");
    }
  };

  const mutationFn = useMutation({
    mutationFn: submitBatchDeposit,
    mutationKey: ["batchDeposit"],
  });

  return {
    submitBatchDeposit: mutationFn,
  };
};
