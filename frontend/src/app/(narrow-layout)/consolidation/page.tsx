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

const ConsolidationWorkflow = () => {
  const walletAddress = useWalletAddress();

  const { groupedValidators, isFetched } = useValidators();
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
    activeValidators: groupedValidators[ValidatorStatus.ACTIVE] ?? [],
  });

  if (!walletAddress || !groupedValidators || !isFetched) {
    return (
      <div className="flex flex-col gap-4">
        <ProgressBar progress={stage.stage} backHandler={goBack} />
        <ConsolidationLoading />
      </div>
    );
  }

  const activeValidators = groupedValidators[ValidatorStatus.ACTIVE] ?? [];

  return (
    <div className="flex w-full flex-col gap-4">
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
      {/**/}
      {/* {stage.stage === "submit" && <SubmitConsolidationRequests />} */}
    </div>
  );
};

export default ConsolidationWorkflow;
