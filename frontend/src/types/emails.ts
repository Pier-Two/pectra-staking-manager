export type EmailMetadata =
  | {
      emailName: "PECTRA_STAKING_MANAGER_CONSOLIDATION_COMPLETE";
      metadata: {
        targetValidatorIndex: number;
      };
    }
  | {
      emailName: "PECTRA_STAKING_MANAGER_WITHDRAWAL_COMPLETE";
      metadata: {
        amount: number;
        withdrawalAddress: string;
      };
    }
  | {
      // TODO: Deposit?
      emailName: "PECTRA_STAKING_MANAGER_DEPLOYMENT_COMPLETE";
      metadata: {
        // The total amount for all the deposits in the BatchDeposit
        totalAmount: number;
      };
    };

// export const EMAIL_TYPE_TO_NAME: Record<EmailNames, EmailMetadata['type']> = {
