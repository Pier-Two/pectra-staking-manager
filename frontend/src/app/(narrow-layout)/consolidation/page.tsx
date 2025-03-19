"use client";

import { type FC, useEffect, useState } from "react";
import { ProgressBar } from "pec/components/consolidation/ProgressBar";
import { SelectDestinationValidator } from "pec/components/consolidation/selectDestinationValidator/SelectDestinationValidator";
import { MOCK_VALIDATORS } from "pec/server/__mocks__/validators";
import type { ValidatorDetails } from "pec/types/validator";
import { SelectSourceValidators } from "pec/components/consolidation/selectSourceValidators/SelectSourceValidators";
import { ConsolidationSummary } from "pec/components/consolidation/summary/ConsolidationSummary";
import { SubmitConsolidationRequests } from "pec/components/consolidation/submitRequests/SubmitConsolidationRequests";

const ConsolidationWorkflow: FC = () => {
  const data = MOCK_VALIDATORS;
  const [progress, setProgress] = useState<number>(1);

  const [selectedDestinationValidator, setSelectedDestinationValidator] =
    useState<ValidatorDetails | null>(null);

  const [selectedSourceTotal, setSelectedSourceTotal] = useState<number>(0);
  const [consolidatedTotal, setConsolidatedTotal] = useState<number>(0);
  const [selectedSourceValidators, setSelectedSourceValidators] = useState<
    ValidatorDetails[]
  >([]);
  const [summaryEmail, setSummaryEmail] = useState<string>("");
  const [consolidationEmail, setConsolidationEmail] = useState<string>("");

  useEffect(() => {
    if (selectedDestinationValidator) {
      const newConsolidatedTotal =
        selectedSourceValidators.reduce(
          (acc, validator) => acc + validator.balance,
          0,
        ) + selectedDestinationValidator.balance;
      setConsolidatedTotal(newConsolidatedTotal);
    }
  }, [selectedSourceValidators, selectedDestinationValidator]);

  useEffect(() => {
    if (progress === 1) setSelectedSourceValidators([]);
  }, [progress]);

  return (
    <div className="flex flex-col gap-4">
      <ProgressBar progress={progress} />

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
              consolidatedTotal={consolidatedTotal}
              destinationValidator={selectedDestinationValidator}
              selectedSourceTotal={selectedSourceTotal}
              selectedSourceValidators={selectedSourceValidators}
              setProgress={setProgress}
              setSelectedDestinationValidator={setSelectedDestinationValidator}
              setSelectedSourceTotal={setSelectedSourceTotal}
              setSelectedSourceValidators={setSelectedSourceValidators}
              validators={data}
            />
          )}

          {selectedSourceValidators.length > 0 && progress === 3 && (
            <ConsolidationSummary
              destinationValidator={selectedDestinationValidator}
              setProgress={setProgress}
              setSelectedDestinationValidator={setSelectedDestinationValidator}
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
