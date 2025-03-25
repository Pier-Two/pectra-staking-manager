"use client";

import { type FC, useState } from "react";
import Image from "next/image";
import {
  EBatchDepositStage,
  type IDepositSignDataCard,
} from "pec/types/batch-deposits";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { SecondaryButton } from "pec/components/ui/custom/SecondaryButton";
import { AlignLeft, Copy, Check, Pencil, Trash2, Eye } from "lucide-react";
import { EIconPosition } from "pec/types/components";
import {
  type Control,
  useController,
  type FieldValues,
  type UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "pec/components/ui/dialog";
import { Badge } from "pec/components/ui/badge";
import type { BatchDepositGenerateTransaction } from "pec/lib/api/schemas/batch-deposit";
interface ExtendedProps extends IDepositSignDataCard {
  control: Control<FieldValues>;
  errors: FieldErrors<BatchDepositGenerateTransaction>;
  register: UseFormRegister<BatchDepositGenerateTransaction>;
}

export const DepositSignDataCard: FC<ExtendedProps> = (props) => {
  const { deposit, control, index, register, stage, errors } = props;
  const { validator, depositAmount } = deposit;

  const [openDialog, setOpenDialog] = useState(false);

  const { field: rawDataField } = useController({
    name: `transactions.${index}.rawDepositData`,
    control,
    rules: { required: true },
  });

  const { field: signedDataField } = useController({
    name: `transactions.${index}.signedDepositData`,
    control,
    rules: { required: true },
  });

  const containsData: boolean = !!rawDataField.value && !!signedDataField.value;

  const handleCopyRawData = () => {
    void navigator.clipboard.writeText(rawDataField.value as string);
  };

  const handleCopySignedData = () => {
    void navigator.clipboard.writeText(signedDataField.value as string);
  };

  const handleDeleteData = () => {
    rawDataField.onChange("");
    signedDataField.onChange("");
  };

  const handleEditData = () => {
    setOpenDialog(true);
  };

  return (
    <>
      <div className="flex-col-3 flex w-full items-center justify-between gap-x-4 rounded-xl border border-indigo-300 bg-white p-4 dark:border-gray-800 dark:bg-black">
        <div className="flex items-center gap-x-4">
          <Image
            src="/icons/EthValidator.svg"
            alt="Validator"
            width={24}
            height={24}
          />

          <div className="flex flex-col">
            <div className="text-md">{validator.validatorIndex}</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {validator.publicKey.slice(0, 5)}...
              {validator.publicKey.slice(-4)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 p-2">
          <AlignLeft className="h-4 w-4" />
          <div className="text-sm">{depositAmount.toFixed(3)}</div>
        </div>

        {(stage === EBatchDepositStage.TRANSACTIONS_SUBMITTED ||
          stage === EBatchDepositStage.TRANSACTIONS_CONFIRMED) && (
          <SecondaryButton
            icon={<Eye className="h-4 w-4" />}
            iconPosition={EIconPosition.LEFT}
            label="View"
            onClick={() => setOpenDialog(true)}
            disabled={false}
          />
        )}

        {stage === EBatchDepositStage.SIGN_DATA && (
          <>
            {containsData ? (
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500" />
                <div className="text-sm">Added</div>
                <Badge
                  variant="outline"
                  className="rounded-full bg-gray-200 p-2 hover:cursor-pointer dark:bg-gray-800"
                  onClick={handleEditData}
                >
                  <Pencil className="h-4 w-4 rounded-full" />
                </Badge>

                <Badge
                  variant="outline"
                  className="rounded-full bg-gray-200 p-2 hover:cursor-pointer dark:bg-gray-800"
                  onClick={handleDeleteData}
                >
                  <Trash2 className="h-4 w-4 rounded-full text-red-500" />
                </Badge>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <SecondaryButton
                  icon={<Copy className="h-4 w-4" />}
                  iconPosition={EIconPosition.LEFT}
                  label="Deposit Data"
                  onClick={handleCopyRawData}
                  disabled={false}
                />

                <PrimaryButton
                  label="Add"
                  disabled={false}
                  onClick={() => setOpenDialog(!openDialog)}
                />
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="!rounded-xl bg-white p-10 text-black dark:bg-black dark:text-white">
          <DialogHeader>
            <DialogTitle>Sign Deposit Data</DialogTitle>
            <DialogDescription className="text-sm text-gray-700 dark:text-gray-300">
              Sign this below deposit data with your validator keys and provide
              the signed message below.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-4">
              <div className="text-md">Raw deposit data</div>
              <textarea
                className="min-h-40 rounded-xl border border-gray-300 bg-gray-100 p-2 text-black dark:border-gray-800 dark:bg-black dark:text-white"
                disabled={stage === EBatchDepositStage.TRANSACTIONS_CONFIRMED}
                {...register(`transactions.${index}.rawDepositData`)}
              />
              
              {errors.transactions?.[index]?.rawDepositData && (
                <div className="text-red-500">
                  {errors.transactions[index].rawDepositData.message}
                </div>
              )}

              <SecondaryButton
                label="Deposit Data"
                icon={<Copy className="h-4 w-4" />}
                iconPosition={EIconPosition.LEFT}
                onClick={handleCopyRawData}
                disabled={false}
              />
            </div>

            <div className="flex flex-col space-y-4">
              <div className="text-md">Signed deposit data</div>
              <textarea
                className="min-h-40 rounded-xl border border-gray-300 bg-white p-2 text-black dark:border-gray-800 dark:bg-black dark:text-white"
                disabled={stage === EBatchDepositStage.TRANSACTIONS_CONFIRMED}
                {...register(`transactions.${index}.signedDepositData`)}
              />

              {errors.transactions?.[index]?.signedDepositData && (
                <div className="text-red-500">
                  {errors.transactions[index].signedDepositData.message}
                </div>
              )}

              <SecondaryButton
                label="Signed Data"
                icon={<Copy className="h-4 w-4" />}
                iconPosition={EIconPosition.LEFT}
                onClick={handleCopySignedData}
                disabled={false}
              />

              <PrimaryButton
                label="Save"
                onClick={() => setOpenDialog(false)}
                disabled={
                  !rawDataField.value ||
                  !signedDataField.value ||
                  stage === EBatchDepositStage.TRANSACTIONS_CONFIRMED
                }
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
