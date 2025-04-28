"use client";

import { ProgressBar } from "pec/components/consolidation/ProgressBar";
import { SelectDestinationValidator } from "pec/components/consolidation/selectDestinationValidator/SelectDestinationValidator";
import { SelectSourceValidators } from "pec/components/consolidation/selectSourceValidators/SelectSourceValidators";
import { useValidators } from "pec/hooks/useValidators";
import { useWalletAddress } from "pec/hooks/useWallet";
import ConsolidationLoading from "../consolidate/loading";
import { ValidatorStatus } from "pec/types/validator";
import { useNewConsolidate } from "pec/hooks/useNewConsolidate";
import { ConsolidationSummary } from "pec/components/consolidation/summary/ConsolidationSummary";
import { SubmitConsolidationRequests } from "pec/components/consolidation/submitRequests/SubmitConsolidationRequests";

const ConsolidationWorkflow = () => {
  const walletAddress = useWalletAddress();

  const { groupedValidators, isFetched } = useValidators();
  const activeValidators = groupedValidators[ValidatorStatus.ACTIVE] ?? [];

  const {
    stage,
    goBack,
    setSourceValidator,
    goToSubmit,
    goToSummary,
    goToSelectSourceValidators,
    getAvailableSourceValidators,
    reset,
  } = useNewConsolidate({
    activeValidators,
  });

  if (!walletAddress || !groupedValidators || !isFetched) {
    return (
      <div className="flex flex-col gap-4">
        <ProgressBar progress={stage.stage} backHandler={goBack} />
        <ConsolidationLoading />
      </div>
    );
  }

  return (
    <div className="-mt-2 flex w-full flex-col gap-6">
      <ProgressBar progress={stage.stage} backHandler={goBack} />

      {stage.stage === "destination" && (
        <SelectDestinationValidator
          validators={activeValidators}
          goToSelectSourceValidators={goToSelectSourceValidators}
        />
      )}

      {stage.stage === "source" && (
        <SelectSourceValidators
          sourceValidators={stage.source}
          destinationValidator={stage.destination}
          goToSummary={goToSummary}
          setSourceValidators={setSourceValidator}
          availableSourceValidators={getAvailableSourceValidators()}
          goBack={goBack}
        />
      )}

      {stage.stage === "summary" && (
        <ConsolidationSummary
          destinationValidator={stage.destination}
          sourceValidators={stage.source}
          goToSubmit={goToSubmit}
          goBack={goBack}
          reset={reset}
        />
      )}

      {stage.stage === "submit" && (
        <SubmitConsolidationRequests
          destination={stage.destination}
          source={stage.source}
          reset={reset}
        />
      )}
    </div>
  );
};

export default ConsolidationWorkflow;
