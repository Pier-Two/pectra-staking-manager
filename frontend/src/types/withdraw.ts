// A transaction is pending if its awaiting signing
type TransactionStatus =
  | { status: "pending" }
  | { status: "signing" }
  | { status: "submitted"; txHash: `0x${string}` }
  | { status: "finalised"; txHash: `0x${string}` }
  | { status: "failed", txHash: `0x${string}` }
  | { status: "failedToSubmit", error: string };

export type TxHashRecord = Record<number, TransactionStatus>;

export type WithdrawWorkflowStages =
  | { type: "data-capture" }
  // Capture all these in a single stage, because validators have their own state and its simpler to handle it like this
  | {
      type: "sign-submit-finalise";
      txHashes: TxHashRecord;
    };
