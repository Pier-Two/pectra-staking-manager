"use client";

import { type FC, useState } from "react";
import { ProgressBar } from "pec/components/consolidation/ProgressBar";
import { SelectDestinationValidator } from "pec/components/consolidation/selectDestinationValidator/SelectDestinationValidator";
import { MOCK_VALIDATORS } from "pec/server/__mocks__/validators";
import type { ValidatorDetails } from "pec/types/validator";
import { SelectSourceValidators } from "pec/components/consolidation/selectSourceValidators/SelectSourceValidators";

const ConsolidationWorkflow: FC = () => {
  const data = MOCK_VALIDATORS;
  const [progress, setProgress] = useState<number>(1);

  const [selectedDestinationValidator, setSelectedDestinationValidator] =
    useState<ValidatorDetails | null>(null);

  const [selectedSourceTotal, setSelectedSourceTotal] = useState<number>(0);
  const [selectedSourceValidators, setSelectedSourceValidators] = useState<
    ValidatorDetails[]
  >([]);

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

      {selectedDestinationValidator && progress === 2 && (
        <SelectSourceValidators
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
    </div>
  );
};

export default ConsolidationWorkflow;
