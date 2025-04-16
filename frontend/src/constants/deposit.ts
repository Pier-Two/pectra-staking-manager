import {
  EDistributionMethod,
  type IDistributionOption,
} from "pec/types/batch-deposits";

export const DISTRIBUTION_OPTIONS: IDistributionOption[] = [
  {
    method: EDistributionMethod.SPLIT,
    title: "Split evenly",
    description:
      "Enter a single total amount and have it deposited evenly across selected validators",
  },
  {
    method: EDistributionMethod.MANUAL,
    title: "Manual entry",
    description:
      "Enter individual deposit amount for each selected validator and submit one transaction for total.",
  },
];

export const SIGNATURE_BYTE_LENGTH = 96;

export const WITHDRAWAL_CREDENTIALS_BYTE_LENGTH = 32;
