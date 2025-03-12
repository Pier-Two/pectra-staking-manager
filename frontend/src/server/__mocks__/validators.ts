import { ValidatorStatus, type ValidatorDetails } from "pec/types/validator";

export const MOCK_VALIDATORS: ValidatorDetails[] = [
  {
    validatorIndex: 499086,
    publicKey:
      "0x937103eb09b42c5937b406fc66a467756c8c9200714dd6fb9e3641710d0a7f002bf36e3a18bf4c066438738957074c99",
    withdrawalAddress: "0x010000000000000000000000278b5e51d0b5f5aa92ac7b5cabf76dd2f86a0917",
    balance: 32.2,
    effectiveBalance: 33.0,
    numberOfWithdrawals: 0,
    status: ValidatorStatus.ACTIVE,
    activeSince: "01-Jan-2025",
    activeDuration: "100 days",
    apy: 3.34,
  },
  {
    validatorIndex: 311400,
    publicKey:
      "0x4tri99876dsjvlc5937b406fc66afhhr98dga9200714dd6fb9e3641710d0a7f002bf36e3a18bf4c066438738957074c99",
    withdrawalAddress: "0x020000000000000000000000278b5e51d0b5f5aa92ac7b5cabf76dd2f86a0917",
    balance: 32.2,
    effectiveBalance: 33.0,
    numberOfWithdrawals: 4,
    status: ValidatorStatus.ACTIVE,
    activeSince: "07-03-2022",
    activeDuration: "3 years 5 days",
    apy: 10.0,
  },
];
