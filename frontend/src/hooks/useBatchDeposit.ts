import { type DepositData } from "pec/lib/api/schemas/deposit";
import { useContracts } from "./useContracts";
import { api } from "pec/trpc/react";
import { prepareContractCall, sendTransaction, waitForReceipt } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { toast } from "sonner";
import { parseEther } from "viem";
import { useState } from "react";
import { client } from "pec/lib/wallet/client";
import { useActiveChainWithDefault } from "./useChain";
import { parseError } from "pec/lib/utils/parseError";
import { generateByteString } from "pec/lib/utils/bytes";
import { SIGNATURE_BYTE_LENGTH } from "pec/constants/deposit";
import { type DepositWorkflowStage } from "pec/types/batch-deposits";

interface BatchDepositRequest {
  pubKey: `0x${string}`;
  amount: bigint;
  signature: `0x${string}`;
  withdrawalCredentials: `0x${string}`;
}

export const useBatchDeposit = () => {
  const [stage, setStage] = useState<DepositWorkflowStage>({
    type: "data-capture",
  });

  const resetStage = () => {
    setStage({ type: "data-capture" });
  };

  const { batchDeposit } = useContracts();
  const account = useActiveAccount();
  const chain = useActiveChainWithDefault();

  const { mutateAsync: saveWithdrawalToDatabase } =
    api.storeEmailRequest.storeDepositRequest.useMutation();

  const submitBatchDeposit = async (
    deposits: DepositData[],
    totalAmount: number,
    email?: string,
  ) => {
    if (!account) {
      toast.error("There was an error depositing");
      return;
    }

    setStage({ type: "sign-data" });

    try {
      const formattedDeposits: BatchDepositRequest[] = deposits.map(
        (deposit) => ({
          pubKey: deposit.validator.publicKey as `0x${string}`,
          amount: parseEther(deposit.amount.toString()),
          signature: generateByteString(SIGNATURE_BYTE_LENGTH),
          withdrawalCredentials: deposit.validator
            .withdrawalAddress as `0x${string}`,
        }),
      );

      const receipt = await sendTransaction({
        account,
        transaction: prepareContractCall({
          contract: batchDeposit,
          method: "batchDeposit",
          params: [formattedDeposits],
          value: parseEther(totalAmount.toString()),
        }),
      });

      const saveWithdrawalDetails = deposits.map((deposit) => ({
        validatorIndex: deposit.validator.validatorIndex,
        txHash: receipt.transactionHash,
        email: email,
      }));

      const result = await saveWithdrawalToDatabase(saveWithdrawalDetails);

      if (!result.success)
        toast.error("There was an error saving the deposit to the database");

      toast.success("Deposits saved successfully");

      setStage({
        type: "transactions-submitted",
        txHash: receipt.transactionHash,
      });

      try {
        const txReceipt = await waitForReceipt({
          transactionHash: receipt.transactionHash,
          client,
          chain,
        });

        setStage({
          type: "transactions-finalised",
          txHash: txReceipt.transactionHash,
        });

        toast.success("Deposits finalised successfully");
      } catch (error) {
        console.error("Error waiting for transaction receipt:", error);
        toast.error("There was an error waiting for the transaction receipt", {
          description: parseError(error),
        });

        setStage({ type: "data-capture" });
      }
    } catch (error) {
      console.error("Error submitting batch deposit:", error);
      toast.error("Error submitting batch deposit", {
        description: parseError(error),
      });

      setStage({ type: "data-capture" });
    }
  };

  return {
    submitBatchDeposit,
    stage,
    resetStage,
  };
};
