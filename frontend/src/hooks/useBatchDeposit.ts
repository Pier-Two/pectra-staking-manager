import { toast } from "pec/components/ui/Toast";
import { SIGNATURE_BYTE_LENGTH } from "pec/constants/deposit";
import { type DepositData } from "pec/lib/api/schemas/deposit";
import { generateByteString } from "pec/lib/utils/bytes";
import { parseError } from "pec/lib/utils/parseError";
import { client } from "pec/lib/wallet/client";
import { api } from "pec/trpc/react";
import { type DepositWorkflowStage } from "pec/types/batch-deposits";
import { useState } from "react";
import { prepareContractCall, sendTransaction, waitForReceipt } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { parseEther } from "viem";
import { useActiveChainWithDefault } from "./useChain";
import { useContracts } from "./useContracts";
import { ValidatorStatus } from "pec/types/validator";

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

  const { mutateAsync: saveDepositToDatabase } =
    api.storeEmailRequest.storeDepositRequest.useMutation();

  const submitBatchDeposit = async (
    deposits: DepositData[],
    totalAmount: number,
    email?: string,
  ) => {
    if (!account) {
      toast({
        title: "Error depositing",
        description: "There was an error depositing",
        variant: "error",
      });
      return;
    }

    const availableDeposits = deposits.filter(
      (deposit) => deposit.validator.status !== ValidatorStatus.EXITED,
    );

    if (availableDeposits.length !== deposits.length) {
      toast({
        title: "Deposits Removed from contract call",
        description:
          "Some validators are currently exiting so they have been removed from this deposit call.",
        variant: "error",
      });
    }

    setStage({ type: "sign-data" });

    try {
      const formattedDeposits: BatchDepositRequest[] = availableDeposits.map(
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

      const saveDepositDetails = availableDeposits.map((deposit) => ({
        validatorIndex: deposit.validator.validatorIndex,
        txHash: receipt.transactionHash,
        email: email,
      }));

      const result = await saveDepositToDatabase(saveDepositDetails);

      if (!result.success)
        toast({
          title: "Error",
          description: "There was an error saving the deposit.",
          variant: "error",
        });

      toast({
        title: "Success",
        description: "Deposits saved successfully",
        variant: "success",
      });

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

        toast({
          title: "Success",
          description: "Deposits finalised successfully",
          variant: "success",
        });
      } catch (error) {
        console.error("Error waiting for transaction receipt:", error);
        toast({
          title: "Error",
          description: parseError(error),
          variant: "error",
        });

        setStage({ type: "data-capture" });
      }
    } catch (error) {
      console.error("Error submitting batch deposit:", error);
      toast({
        title: "Error",
        description: parseError(error),
        variant: "error",
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
