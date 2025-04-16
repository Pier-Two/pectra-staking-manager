export type WithdrawWorkflowStages =
  | { type: "data-capture" }
  | { type: "transactions-submitted"; txHashes: Record<number, string> }
  | { type: "transactions-finalised"; txHashes: Record<number, string> };
