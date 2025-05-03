export type EmailPayload =
  | {
      emailName: "PECTRA_STAKING_MANAGER_CONSOLIDATION_COMPLETE";
      metadata: {
        emailAddress: string | undefined;
        targetValidatorIndex: number;
      };
    }
  | {
      emailName: "PECTRA_STAKING_MANAGER_WITHDRAWAL_COMPLETE";
      metadata: {
        emailAddress: string | undefined;
        amount: number;
        withdrawalAddress: string;
      };
    }
  | {
      emailName: "PECTRA_STAKING_MANAGER_DEPOSIT_COMPLETE";
      metadata: {
        emailAddress: string | undefined;
        // The total amount for all the deposits in the BatchDeposit
        totalAmount: number;
      };
    };
