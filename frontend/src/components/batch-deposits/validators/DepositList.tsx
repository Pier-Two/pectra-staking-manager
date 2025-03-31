import type { FC } from "react";
import {
  useForm,
  useFieldArray,
  type Control,
  type FieldValues,
} from "react-hook-form";
import {
  EBatchDepositStage,
  type IDepositList,
} from "pec/types/batch-deposits";
import { ValidatorListHeaders } from "./ValidatorListHeaders";
import { DepositSignDataCard } from "pec/components/validators/cards/DepositSignDataCard";
import { DistributionInformation } from "../distribution/DistributionInformation";
import {
  BatchDepositGenerateTransactionSchema,
  type BatchDepositGenerateTransaction,
} from "pec/lib/api/schemas/batch-deposit";
import { zodResolver } from "@hookform/resolvers/zod";

export const DepositList: FC<IDepositList> = ({
  deposits,
  resetBatchDeposit,
  setStage,
  stage,
  totalAllocated,
  totalToDistribute,
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<BatchDepositGenerateTransaction>({
    resolver: zodResolver(BatchDepositGenerateTransactionSchema),
    defaultValues: {
      transactions: deposits.map(() => ({
        rawDepositData: "",
        signedDepositData: "",
      })),
    },
    mode: "onChange",
  });

  const { fields } = useFieldArray({
    control,
    name: "transactions",
  });

  const onSubmit = (data: BatchDepositGenerateTransaction) => {
    // TODO Max
    // Handle the submission of transaction data
    // Set the stage to TRANSACTIONS_CONFIRMED when all transactions are submitted
    if (stage === EBatchDepositStage.TRANSACTIONS_SUBMITTED) {
      console.log("onSubmit HIT: ", data);
      setStage(EBatchDepositStage.TRANSACTIONS_CONFIRMED);
    }
  };

  return (
    <form className="flex flex-col gap-y-4" onSubmit={handleSubmit(onSubmit)}>
      <DistributionInformation
        buttonText="Submit transaction"
        disableButton={!isValid}
        onClick={handleSubmit(onSubmit)}
        resetBatchDeposit={resetBatchDeposit}
        selectedValidators={deposits}
        stage={stage}
        setStage={setStage}
        totalAllocated={totalAllocated}
        totalToDistribute={totalToDistribute}
      />

      <div className="text-lg">Deposits</div>
      <ValidatorListHeaders
        columnHeaders={[
          {
            label: "Validator",
            showSort: true,
          },
          {
            label: "Deposit",
            showSort: true,
          },
          {
            label: "Deposit Data",
            showSort: false,
          },
        ]}
        sortColumn={""}
        sortDirection={null}
        onSort={() => {}}
      />

      {fields.map((field, index) => {
        const deposit = deposits[index] ?? null;
        return deposit ? (
          <DepositSignDataCard
            key={field.id}
            control={control as unknown as Control<FieldValues>}
            deposit={deposit}
            index={index}
            register={register}
            stage={stage}
            errors={errors}
          />
        ) : null;
      })}
    </form>
  );
};
