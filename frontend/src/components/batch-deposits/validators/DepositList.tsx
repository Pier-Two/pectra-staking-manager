import type { FC } from "react";
import {
  useForm,
  useFieldArray,
  type Control,
  type FieldValues,
} from "react-hook-form";
import {
  EBatchDepositStage,
  type IBatchDepositTransactionData,
  type IDepositList,
} from "pec/types/batch-deposits";
import { ValidatorListHeaders } from "./ValidatorListHeaders";
import { DepositSignDataCard } from "pec/components/validators/cards/DepositSignDataCard";
import { DistributionInformation } from "../distribution/DistributionInformation";

type FormValues = {
  transactions: IBatchDepositTransactionData[];
};

export const DepositList: FC<IDepositList> = (props) => {
  const {
    deposits,
    resetBatchDeposit,
    setStage,
    stage,
    totalAllocated,
    totalToDistribute,
  } = props;

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormValues>({
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

  const onSubmit = (data: FormValues) => {
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
      <ValidatorListHeaders labels={["Validator", "Deposit", "Deposit Data"]} />

      {fields.map((field, index) => {
        const deposit = deposits[index] ?? null;
        return deposit ? (
          <DepositSignDataCard
            key={field.id}
            control={control as unknown as Control<FieldValues>}
            deposit={deposit}
            index={index}
            stage={stage}
          />
        ) : null;
      })}
    </form>
  );
};
