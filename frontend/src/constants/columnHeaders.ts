import type { ValidatorDetails } from "pec/types/validator";
import type {
  IHeaderConfig,
  TableValidatorDetails,
} from "pec/types/validatorTable";
import { TransactionStatus } from "pec/types/withdraw";

export type WithdrawalTableValidatorDetails = TableValidatorDetails & {
  withdrawalAmount: number;
};

export const WITHDRAWAL_COLUMN_HEADERS: IHeaderConfig<WithdrawalTableValidatorDetails>[] =
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

export const DASHBOARD_VALIDATOR_COLUMN_HEADERS: IHeaderConfig<ValidatorDetails>[] =
  [
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

export const CONSOLIDATION_TABLE_HEADERS: IHeaderConfig<ValidatorDetails>[] = [
  { label: "Validator", sortKey: "validatorIndex", mobile: true },
  { label: "Credentials", sortKey: "withdrawalAddress", mobile: true },
  { label: "Balance", sortKey: "balance", mobile: true },
];

export interface SubmittingConsolidationValidatorDetails
  extends ValidatorDetails {
  transactionStatus: TransactionStatus;
  consolidationType: "upgrade" | "consolidate";
}

export const SUBMITTING_CONSOLIDATION_TABLE_HEADERS: IHeaderConfig<SubmittingConsolidationValidatorDetails>[] =
  [
    { label: "Validator", sortKey: "validatorIndex", mobile: true },
    { label: "Type", sortKey: "consolidationType", mobile: true },
    { label: "Status", sortKey: "transactionStatus", mobile: true },
  ];
