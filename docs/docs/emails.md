---
sidebar_position: 3
---

# Emails

Email logic is handled via PierTwo, we've simply integrated with 2 routes;
- Create Contact `https://gw-1.api.piertwo.io/integrations/hubspot/contacts`
- Send Email Notification `https://gw-1.api.piertwo.io/integrations/hubspot/email`

## Send email notification

Our email payload is the following type:

```ts
export type EmailPayload =
  | {
      emailName: "PECTRA_STAKING_MANAGER_CONSOLIDATION_COMPLETE";
      metadata: {
        emailAddress: string;
        targetValidatorIndex: number;
      };
    }
  | {
      emailName: "PECTRA_STAKING_MANAGER_WITHDRAWAL_COMPLETE";
      metadata: {
        emailAddress: string;
        amount: number;
        withdrawalAddress: string;
      };
    }
  | {
      emailName: "PECTRA_STAKING_MANAGER_DEPOSIT_COMPLETE";
      metadata: {
        emailAddress: string;
        // The total amount for all the deposits in the BatchDeposit
        totalAmount: number;
      };
    };
```

## Create contact

We call the create contact route whenever someone saves a deposit, withdrawal or consolidation to our database with an email. This registers their email in PierTwo's Hubspot.
