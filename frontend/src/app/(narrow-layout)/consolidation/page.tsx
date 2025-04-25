"use client";

import { ProgressBar } from "pec/components/consolidation/ProgressBar";
import { SelectDestinationValidator } from "pec/components/consolidation/selectDestinationValidator/SelectDestinationValidator";
import { SelectSourceValidators } from "pec/components/consolidation/selectSourceValidators/SelectSourceValidators";
import { SubmitConsolidationRequests } from "pec/components/consolidation/submitRequests/SubmitConsolidationRequests";
import { ConsolidationSummary } from "pec/components/consolidation/summary/ConsolidationSummary";
import { useConsolidationStore } from "pec/hooks/use-consolidation-store";
import { useValidators } from "pec/hooks/useValidators";
import { useWalletAddress } from "pec/hooks/useWallet";
import ConsolidationLoading from "../consolidate/loading";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ValidatorStatus } from "pec/types/validator";

const ConsolidationWorkflow = () => {
  const walletAddress = useWalletAddress();
  const router = useRouter();

  const { groupedValidators, isFetched } = useValidators();

  const { progress, reset, back } = useConsolidationStore();

  const backHandler = () => {
    if (progress === "destination") {
      router.push("/consolidate");

      return;
    }

    back();
  };

  useEffect(() => {
    // Reset the store when someone leaves the page
    return () => reset();
  }, [reset]);

  if (!walletAddress || !groupedValidators || !isFetched) {
    return (
      <div className="flex flex-col gap-4">
        <ProgressBar progress={progress} backHandler={backHandler} />
        <ConsolidationLoading />
      </div>
    );
  }

  const activeValidators = groupedValidators[ValidatorStatus.ACTIVE] ?? [];

  return (
    <div className="flex w-full flex-col gap-4">
      <ProgressBar progress={progress} backHandler={backHandler} />

      {progress === "destination" && (
        <SelectDestinationValidator validators={activeValidators} />
      )}

      {progress === "source" && <SelectSourceValidators />}

      {progress === "summary" && <ConsolidationSummary />}

      {progress === "submit" && <SubmitConsolidationRequests />}
    </div>
  );
};

export default ConsolidationWorkflow;
