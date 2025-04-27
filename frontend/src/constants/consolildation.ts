import { ValidatorDetails } from "pec/types/validator";
import { IHeaderConfig } from "pec/types/validatorTable";

export const CONSOLIDATION_TABLE_HEADERS: IHeaderConfig<ValidatorDetails>[] = [
  { label: "Validator", sortKey: "validatorIndex", mobile: true },
  { label: "Credentials", sortKey: "withdrawalAddress", mobile: true },
  { label: "Balance", sortKey: "balance", mobile: true },
];
