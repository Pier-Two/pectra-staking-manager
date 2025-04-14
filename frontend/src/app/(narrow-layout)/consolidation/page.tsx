"use client";

import { ProgressBar } from "pec/components/consolidation/ProgressBar";
import { SelectDestinationValidator } from "pec/components/consolidation/selectDestinationValidator/SelectDestinationValidator";
import { SelectSourceValidators } from "pec/components/consolidation/selectSourceValidators/SelectSourceValidators";
import { SubmitConsolidationRequests } from "pec/components/consolidation/submitRequests/SubmitConsolidationRequests";
import { ConsolidationSummary } from "pec/components/consolidation/summary/ConsolidationSummary";
import { useConsolidationStore } from "pec/hooks/use-consolidation-store";
import { useWalletAddress } from "pec/hooks/useWallet";
import { api } from "pec/trpc/react";
import ConsolidationLoading from "../consolidate/loading";

const ConsolidationWorkflow = () => {
  const walletAddress = useWalletAddress();

  const { data, isFetched } = api.validators.getValidators.useQuery(
    {
      address: walletAddress || "",
    },
    { enabled: !!walletAddress },
  );

  const {
    validatorsToConsolidate,
    consolidationTarget,
    progress,
    setProgress,
  } = useConsolidationStore();

  if (!walletAddress || !data || !isFetched) {
    return (
      <div className="flex flex-col gap-4">
        <ProgressBar progress={progress} setProgress={setProgress} />
        <ConsolidationLoading />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <ProgressBar progress={progress} setProgress={setProgress} />

      {progress === 1 && <SelectDestinationValidator />}

      {consolidationTarget && (
        <>
          {progress === 2 && <SelectSourceValidators />}

          {validatorsToConsolidate.length > 0 && progress === 3 && (
            <ConsolidationSummary />
          )}

          {validatorsToConsolidate.length > 0 && progress === 4 && (
            <SubmitConsolidationRequests />
          )}
        </>
      )}
    </div>
  );
};

export default ConsolidationWorkflow;
