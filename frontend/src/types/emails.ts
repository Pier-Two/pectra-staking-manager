import type { EMAIL_NAMES } from "pec/constants/email";

export type EmailNames = (typeof EMAIL_NAMES)[number];

export type EmailMetadata =
  | { type: "consolidation"; targetValidatorIndex: number }
  | { type: "withdrawal"; targetValidatorIndex: number }
  | { type: "validatorUpgrade"; targetValidatorIndex: number };
