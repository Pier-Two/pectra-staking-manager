import { useConsolidationValidatorTable } from "pec/hooks/useConsolidationValidatorTable";
import { ValidatorHeader } from "../batch-deposits/validators/ValidatorHeader";
import { ValidatorDetails } from "pec/types/validator";

interface ConsolidationValidatorTableProps {
  validators: ValidatorDetails[];
}

export const ConsolidationValidatorTable = ({
  validators,
}: ConsolidationValidatorTableProps) => {
  const {} = useConsolidationValidatorTable(validators);

  return (
    <div className="flex flex-col">
      <ValidatorHeader />
    </div>
  );
};
