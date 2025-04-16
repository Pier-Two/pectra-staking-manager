import { DepositData } from "pec/lib/api/schemas/deposit";
import { useContracts } from "./useContracts"
import { api } from "pec/trpc/react";

export const useBatchDeposit = () => {
  const contracts = useContracts();

    const { mutateAsync: saveWithdrawalToDatabase } =
    api.storeEmailRequest.storeDepositRequest.useMutation();


  const submitBatchDeposit = async (deposits: DepositData[]) => {
    const tx = await contracts.batchDeposit(deposits);
    return tx;
  }


  
