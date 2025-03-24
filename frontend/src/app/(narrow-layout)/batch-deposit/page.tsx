"use client";

import { type FC, useState, useEffect } from "react";
import { api } from "pec/trpc/react";
import { useWalletAddress } from "pec/hooks/useWallet";
import BatchDepositLoading from "./loading";
import { ArrowDownToDot } from "lucide-react";
import { SignatureDetails } from "pec/components/batch-deposits/SignatureDetails";
import { MOCK_VALIDATORS } from "pec/server/__mocks__/validators";
import {
  type IBatchDepositValidators,
  EDistributionMethod,
} from "pec/types/batch-deposits";
import { DistributionMethod } from "pec/components/batch-deposits/DistributionMethod";
import { SelectValidators } from "pec/components/batch-deposits/SelectValidators";

const BatchDeposit: FC = () => {
  // const walletAddress = useWalletAddress();
  //const { balance, loading, error } = useWalletBalance();
  // if (!walletAddress) return <BatchDepositLoading />;

  // const { data } = api.validators.getValidators.useQuery({
  //   address: walletAddress,
  // });
  // if (!data) return <BatchDepositLoading />;

  const data = MOCK_VALIDATORS;
  const balance = 0;

  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [totalToDistribute, setTotalToDistribute] = useState<number>(0);
  const [totalAllocated, setTotalAllocated] = useState<number>(0);

  useEffect(() => {
    const shouldBeDisabled =
      totalAllocated !== totalToDistribute ||
      totalToDistribute === 0 ||
      totalAllocated === 0;

    if (disableButton !== shouldBeDisabled) setDisableButton(shouldBeDisabled);
  }, [totalAllocated, totalToDistribute, disableButton]);

  const [distributionMethod, setDistributionMethod] =
    useState<EDistributionMethod>(EDistributionMethod.SPLIT);

  const [selectedValidators, setSelectedValidators] = useState<
    IBatchDepositValidators[]
  >([]);

  const changeDistributionMethod = () => {
    setSelectedValidators([]);
    setTotalAllocated(0);
    setTotalToDistribute(0);
  };

  const clearSelectedValidators = () => {
    setSelectedValidators([]);
    setTotalAllocated(0);
  };

  const evenlySplitSelectedValidators = (
    validators: IBatchDepositValidators[],
  ) => {
    if (validators.length === 0) return [];
    const depositAmount = totalToDistribute / validators.length;
    return validators.map((v) => ({ ...v, depositAmount }));
  };

  const handleSelectValidator = (validator: IBatchDepositValidators) => {
    const isRemoving = selectedValidators.some(
      (v) => v.validator.validatorIndex === validator.validator.validatorIndex,
    );

    const newValidators = isRemoving
      ? selectedValidators.filter(
          (v) =>
            v.validator.validatorIndex !== validator.validator.validatorIndex,
        )
      : [...selectedValidators, validator];

    const finalValidators =
      distributionMethod === EDistributionMethod.SPLIT
        ? evenlySplitSelectedValidators(newValidators)
        : newValidators;

    setSelectedValidators(finalValidators);
    setTotalAllocated(
      finalValidators.reduce((acc, v) => acc + v.depositAmount, 0),
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex gap-x-4">
          <ArrowDownToDot className="h-10 w-10" />
          <div className="text-3xl">Batch Deposit</div>
        </div>

        <div className="w-[45vw] text-gray-700">
          Top up your existing validators in one transaction.
        </div>
      </div>

      <SignatureDetails />

      <DistributionMethod
        changeDistributionMethod={changeDistributionMethod}
        distributionMethod={distributionMethod}
        setDistributionMethod={setDistributionMethod}
        setTotalToDistribute={setTotalToDistribute}
        selectedValidators={selectedValidators}
        disableButton={disableButton}
        totalAllocated={totalAllocated}
        walletBalance={balance}
        totalToDistribute={totalToDistribute}
      />

      {totalToDistribute !== 0 && (
        <SelectValidators
          clearSelectedValidators={clearSelectedValidators}
          distributionMethod={distributionMethod}
          selectedValidators={selectedValidators}
          setSelectedValidators={handleSelectValidator}
          totalAllocated={totalAllocated}
          totalToDistribute={totalToDistribute}
          validators={data}
        />
      )}
    </div>
  );
};

export default BatchDeposit;
