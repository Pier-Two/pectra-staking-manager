import type { IHeaderConfig } from "pec/types/validatorTable";

export const WITHDRAWAL_COLUMN_HEADERS = [
  { label: "Validator", showSort: true },
  { label: "Balance", showSort: true },
  { label: "Withdrawal", showSort: false },
] as const;

export const DEPOSIT_COLUMN_HEADERS = [
  { label: "Validator", showSort: true },
  { label: "Balance", showSort: true },
  { label: "Deposit", showSort: false },
] as const;

export const DASHBOARD_VALIDATOR_COLUMN_HEADERS: IHeaderConfig[] = [
  { label: "Validator", sortKey: "validatorIndex" },
  { label: "Active since", sortKey: "activeSince" },
  { label: "Credentials", sortKey: "withdrawalAddress" },
  { label: "Status", sortKey: "status" },
  { label: "Balance", sortKey: "balance" },
];

export const SIGN_DEPOSIT_COLUMN_HEADERS = [
  {
    label: "Validator",
    showSort: false,
  },
  {
    label: "Deposit",
    showSort: false,
  },
  {
    label: "Status",
    showSort: false,
  },
];
