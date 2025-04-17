export type TxHashRecord = Record<
  number,
  { txHash: `0x${string}`; isFinalised: boolean }
>;

export type WithdrawWorkflowStages =
  | { type: "data-capture" }
  | {
      type: "transactions-submitted";
      txHashes: TxHashRecord;
    };
