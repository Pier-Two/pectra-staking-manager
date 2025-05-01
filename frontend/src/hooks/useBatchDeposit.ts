import { toast } from "pec/components/ui/Toast";
import { SIGNATURE_BYTE_LENGTH } from "pec/constants/deposit";
import { type DepositData } from "pec/lib/api/schemas/deposit";
import { generateByteString } from "pec/lib/utils/bytes";
import { parseError } from "pec/lib/utils/parseError";
import { client } from "pec/lib/wallet/client";
import { api } from "pec/trpc/react";
import { type DepositWorkflowStage } from "pec/types/batch-deposits";
import { useEffect, useState } from "react";
import { prepareContractCall, sendTransaction, waitForReceipt } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { parseEther } from "viem";
import { useActiveChainWithDefault } from "./useChain";
import { useContracts } from "./useContracts";
import { ValidatorStatus } from "pec/types/validator";
import { trackEvent } from "pec/helpers/trackEvent";

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

  // track stage
  useEffect(() => {
    trackEvent(`batch_deposit_stage_changed`, {
      stage: stage.type,
    });
  }, [stage]);

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

    if (
      deposits.some(
        (deposit) => deposit.validator.status === ValidatorStatus.EXITED,
      )
    ) {
      toast({
        title: "Error",
        description: "Some validators have exited the network.",
        variant: "error",
      });
      return;
    }

    setStage({ type: "sign-submit", transactionStatus: { status: "signing" } });

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

      setStage({
        type: "sign-submit",
        transactionStatus: {
          status: "submitted",
          txHash: receipt.transactionHash,
        },
      });

      const saveDepositDetails = deposits.map((deposit) => ({
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

      // track event
      trackEvent("batch_deposit_submitted", {
        totalAmount,
        validatorIndexes: `[${deposits.map((deposit) => deposit.validator.validatorIndex).join(",")}]`,
      });

      if (email) {
        trackEvent("batch_deposit_email_submitted");
      }

      const txReceipt = await waitForReceipt({
        transactionHash: receipt.transactionHash,
        client,
        chain,
      });

      setStage({
        type: "sign-submit",
        transactionStatus: {
          status: "finalised",
          txHash: txReceipt.transactionHash,
        },
      });

      toast({
        title: "Success",
        description: "Deposits finalised successfully",
        variant: "success",
      });

      // track event
      trackEvent("batch_deposit_finalised", {
        totalAmount,
        validatorIndexes: `[${deposits.map((deposit) => deposit.validator.validatorIndex).join(",")}]`,
      });
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
