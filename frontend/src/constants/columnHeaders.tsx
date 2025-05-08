import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "pec/components/ui/tooltip";
import type { ValidatorDetails } from "pec/types/validator";
import type {
  IHeaderConfig,
  TableValidatorDetails,
} from "pec/types/validatorTable";
import { type TransactionStatus } from "pec/types/withdraw";

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

export type DepositTableValidatorDetails = TableValidatorDetails & {
  depositAmount: number;
};

export const DEPOSIT_COLUMN_HEADERS: IHeaderConfig<DepositTableValidatorDetails>[] =
  [
    { label: "Validator", sortKey: "validatorIndex", mobile: true },
    { label: "Balance", sortKey: "balance", mobile: true },
    { label: "Deposit", sortKey: "depositAmount", mobile: true },
  ] as const;

export const SUBMITTING_DEPOSIT_COLUMN_HEADERS: IHeaderConfig<DepositTableValidatorDetails>[] =
  [
    { label: "Validator", sortKey: "validatorIndex", mobile: true },
    { label: "Deposit", sortKey: "depositAmount", mobile: true },
    {
      label: "Transaction",
      sortKey: "transactionStatus",
      mobile: true,
    },
  ] as const;

export const DASHBOARD_VALIDATOR_COLUMN_HEADERS: IHeaderConfig<ValidatorDetails>[] =
  [
    { label: "Validator", sortKey: "validatorIndex", mobile: true },
    { label: "Active since", sortKey: "activeSince" },
    { label: "Credentials", sortKey: "withdrawalAddress", mobile: true },
    { label: "Status", sortKey: "status" },
    {
      label: (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-1">
                Active balance
                <Info className="h-4 w-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Your current balance plus any pending withdrawals.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
      sortKey: "balance",
      mobile: true,
    },
    {
      label: (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-1">
                Pending balance
                <Info className="h-4 w-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Your active balance plus pending deposits and consolidations
                minus pending withdrawals.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
      sortKey: "pendingBalance",
      mobile: true,
    },
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
