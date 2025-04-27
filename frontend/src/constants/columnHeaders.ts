import type {
  IHeaderConfig,
  TableValidatorDetails,
} from "pec/types/validatorTable";

export const WITHDRAWAL_COLUMN_HEADERS = [
  { label: "Validator", showSort: true },
  { label: "Balance", showSort: true },
  { label: "Withdrawal", showSort: false },
] as const;

export type WithdrawalTableValidatorDetails = TableValidatorDetails & {
  withdrawalAmount: number;
};

export const NEW_WITHDRAWAL_COLUMN_HEADERS: IHeaderConfig<WithdrawalTableValidatorDetails>[] =
  [
    { label: "Validator", sortKey: "validatorIndex", mobile: true },
    { label: "Balance", sortKey: "balance", mobile: true },
    {
      label: "Withdrawal",
      sortKey: "withdrawalAmount",
      mobile: true,
    },
  ];

export const SUBMITTING_WITHDRAWAL_COLUMN_HEADERS: IHeaderConfig<WithdrawalTableValidatorDetails>[] =
  [
    { label: "Validator", sortKey: "validatorIndex", mobile: true },
    { label: "Withdrawal", sortKey: "withdrawalAmount", mobile: true },
    {
      label: "Transaction",
      sortKey: "transactionStatus",
      mobile: true,
    },
  ];
export const DEPOSIT_COLUMN_HEADERS = [
  { label: "Validator", showSort: true },
  { label: "Balance", showSort: true },
  { label: "Deposit", showSort: false },
] as const;

export const SIGN_WITHDRAWAL_COLUMN_HEADERS = [
  { label: "Validator", showSort: true },
  { label: "Balance", showSort: true },
  { label: "Status", showSort: false },
] as const;

export const DASHBOARD_VALIDATOR_COLUMN_HEADERS: IHeaderConfig[] = [
  { label: "Validator", sortKey: "validatorIndex", mobile: true },
  { label: "Active since", sortKey: "activeSince" },
  { label: "Credentials", sortKey: "withdrawalAddress", mobile: true },
  { label: "Status", sortKey: "status" },
  { label: "Balance", sortKey: "balance", mobile: true },
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
