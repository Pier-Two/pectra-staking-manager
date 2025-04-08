"use client";

import { ProgressBar } from "pec/components/consolidation/ProgressBar";
import { SelectDestinationValidator } from "pec/components/consolidation/selectDestinationValidator/SelectDestinationValidator";
import { SelectSourceValidators } from "pec/components/consolidation/selectSourceValidators/SelectSourceValidators";
import { SubmitConsolidationRequests } from "pec/components/consolidation/submitRequests/SubmitConsolidationRequests";
import { ConsolidationSummary } from "pec/components/consolidation/summary/ConsolidationSummary";
import { useWalletAddress } from "pec/hooks/useWallet";
import { api } from "pec/trpc/react";
import type { ValidatorDetails } from "pec/types/validator";
import { type FC, useEffect, useState } from "react";
import ConsolidationLoading from "../consolidate/loading";

const ConsolidationWorkflow: FC = () => {
  const walletAddress = useWalletAddress();

  const { data, isFetched } = api.validators.getValidators.useQuery(
    {
      address: walletAddress || "",
    },
    { enabled: !!walletAddress },
  );

  const [progress, setProgress] = useState<number>(1);

  const [selectedDestinationValidator, setSelectedDestinationValidator] =
    useState<ValidatorDetails | null>(null);

  const [selectedSourceValidators, setSelectedSourceValidators] = useState<
    ValidatorDetails[]
  >([]);
  const [summaryEmail, setSummaryEmail] = useState<string>("");
  const [consolidationEmail, setConsolidationEmail] = useState<string>("");

  useEffect(() => {
    if (progress === 1) setSelectedSourceValidators([]);
  }, [progress]);

  if (!walletAddress || !data || !isFetched) return <ConsolidationLoading />;

  return (
    <div className="flex flex-col gap-4">
      <ProgressBar progress={progress} setProgress={setProgress} />

      {progress === 1 && (
        <SelectDestinationValidator
          setProgress={setProgress}
          setSelectedDestinationValidator={setSelectedDestinationValidator}
          validators={data}
        />
      )}

      {selectedDestinationValidator && (
        <>
          {progress === 2 && (
            <SelectSourceValidators
              destinationValidator={selectedDestinationValidator}
              selectedSourceValidators={selectedSourceValidators}
              setProgress={setProgress}
              setSelectedDestinationValidator={setSelectedDestinationValidator}
              setSelectedSourceValidators={setSelectedSourceValidators}
              validators={data}
            />
          )}

          {selectedSourceValidators.length > 0 && progress === 3 && (
            <ConsolidationSummary
              destinationValidator={selectedDestinationValidator}
              setProgress={setProgress}
              setSelectedDestinationValidator={setSelectedDestinationValidator}
              setSelectedSourceValidators={setSelectedSourceValidators}
              setSummaryEmail={setSummaryEmail}
              sourceValidators={selectedSourceValidators}
              summaryEmail={summaryEmail}
            />
          )}

          {selectedSourceValidators.length > 0 && progress === 4 && (
            <SubmitConsolidationRequests
              consolidationEmail={consolidationEmail}
              destinationValidator={selectedDestinationValidator}
              setConsolidationEmail={setConsolidationEmail}
              sourceValidators={selectedSourceValidators}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ConsolidationWorkflow;
