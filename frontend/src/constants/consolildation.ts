import { IHeaderConfig } from "pec/types/validatorTable";

export const CONSOLIDATION_TABLE_HEADERS: IHeaderConfig[] = [
  { label: "Validator", sortKey: "validatorIndex", mobile: true },
  { label: "Credentials", sortKey: "withdrawalAddress", mobile: true },
  { label: "Balance", sortKey: "balance", mobile: true },
];
