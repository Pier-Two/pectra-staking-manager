"use client";

import { ProgressBar } from "pec/components/consolidation/ProgressBar";
import { SelectDestinationValidator } from "pec/components/consolidation/selectDestinationValidator/SelectDestinationValidator";
import { SelectSourceValidators } from "pec/components/consolidation/selectSourceValidators/SelectSourceValidators";
import { useValidators } from "pec/hooks/useValidators";
import { useWalletAddress } from "pec/hooks/useWallet";
import { ValidatorStatus } from "pec/types/validator";
import { ConsolidationSummary } from "pec/components/consolidation/summary/ConsolidationSummary";
import { SubmitConsolidationRequests } from "pec/components/consolidation/submitRequests/SubmitConsolidationRequests";
import { Skeleton } from "pec/components/ui/skeleton";
import {
  StageAnimationParent,
  StageAnimationStep,
} from "pec/components/stage-animation";
import { useConsolidate } from "pec/hooks/useConsolidate";

const ConsolidationWorkflow = () => {
  const walletAddress = useWalletAddress();

  const { groupedValidators, isSuccess } = useValidators();
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
    email,
    setEmail,
  } = useConsolidate({
    activeValidators,
  });

  if (!walletAddress || !groupedValidators || !isSuccess) {
    return (
      <div className="flex w-full flex-col gap-6">
        <ProgressBar progress={stage.stage} backHandler={goBack} />
        <div className="flex w-full flex-col space-y-4">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <ProgressBar progress={stage.stage} backHandler={goBack} />

      <StageAnimationParent
        stage={stage.stage}
        stageOrder={["destination", "source", "summary", "submit"]}
        stepClassName="w-full"
      >
        {stage.stage === "destination" && (
          <StageAnimationStep key="destination">
            <SelectDestinationValidator
              validators={activeValidators}
              goToSelectSourceValidators={goToSelectSourceValidators}
            />
          </StageAnimationStep>
        )}

        {stage.stage === "source" && (
          <StageAnimationStep key="source">
            <SelectSourceValidators
              sourceValidators={stage.sourceValidator}
              destinationValidator={stage.destinationValidator}
              goToSummary={goToSummary}
              setSourceValidators={setSourceValidator}
              availableSourceValidators={getAvailableSourceValidators()}
              goBack={goBack}
            />
          </StageAnimationStep>
        )}

        {stage.stage === "summary" && (
          <StageAnimationStep key="summary">
            <ConsolidationSummary
              sourceValidators={stage.sourceValidator}
              destinationValidator={stage.destinationValidator}
              upgradeTransactions={stage.transactions.upgradeTransactions}
              consolidationTransactions={
                stage.transactions.consolidationTransactions
              }
              goToSubmit={goToSubmit}
              goBack={goBack}
              reset={reset}
              email={email}
              setEmail={setEmail}
            />
          </StageAnimationStep>
        )}

        {stage.stage === "submit" && (
          <StageAnimationStep key="submit">
            <SubmitConsolidationRequests
              destination={stage.destinationValidator}
              transactions={stage.transactions.transactions}
              upgradeTransactions={stage.transactions.upgradeTransactions}
              consolidationTransactions={
                stage.transactions.consolidationTransactions
              }
            />
          </StageAnimationStep>
        )}
      </StageAnimationParent>
    </div>
  );
};

export default ConsolidationWorkflow;
