  import {
  ValidatorStatus,
  TransactionStatus,
  type ValidatorDetails,
} from "pec/types/validator";

export const MOCK_VALIDATORS: ValidatorDetails[] = [
  {
    validatorIndex: 499086,
    publicKey:
      "0x937103eb09b42c5937b406fc66a467756c8c9200714dd6fb9e3641710d0a7f002bf36e3a18bf4c066438738957074c99",
    withdrawalAddress:
      "0x010000000000000000000000278b5e51d0b5f5aa92ac7b5cabf76dd2f86a0917",
    balance: 32.2,
    effectiveBalance: 33.0,
    numberOfWithdrawals: 0,
    status: ValidatorStatus.ACTIVE,
    activeSince: "01-Jan-2025",
    activeDuration: "100 days",
    apy: 3.34,
    transactionStatus: TransactionStatus.SUBMITTED,
    transactionHash: "0x1234567890abcdef",
  },
  {
    validatorIndex: 311400,
    publicKey:
      "0x4tri99876dsjvlc5937b406fc66afhhr98dga9200714dd6fb9e3641710d0a7f002bf36e3a18bf4c066438738957074c99",
    withdrawalAddress:
      "0x020000000000000000000000278b5e51d0b5f5aa92ac7b5cabf76dd2f86a0917",
    balance: 32.2,
    effectiveBalance: 33.0,
    numberOfWithdrawals: 4,
    status: ValidatorStatus.ACTIVE,
    activeSince: "07-03-2022",
    activeDuration: "3 years 5 days",
    apy: 10.0,
    transactionStatus: TransactionStatus.IN_PROGRESS,
    transactionHash: "0x1234567890abcdef",
  },
  ...Array.from({ length: 4 }, (_, i) => ({
    validatorIndex: 500000 + i,
    publicKey: `0x${Math.random().toString(16).slice(2, 66)}`,
    withdrawalAddress: `0x0${i}0000000000000000000000278b5e51d0b5f5aa92ac7b5cabf76dd2f86a0917`,
    balance: +(32 + Math.random()).toFixed(1),
    effectiveBalance: +(32 + Math.random()).toFixed(1),
    numberOfWithdrawals: Math.floor(Math.random() * 10),
    status:
      i < 15
        ? ValidatorStatus.ACTIVE
        : i < 19
          ? ValidatorStatus.PENDING
          : ValidatorStatus.INACTIVE,
    activeSince: i < 15 ? "2023-06-15" : "2025-01-01",
    activeDuration: i < 15 ? "8 months" : "3 months",
    apy: +(Math.random() * 10).toFixed(2),
    transactionStatus: TransactionStatus.UPCOMING,
    transactionHash: "0x1234567890abcdef",
  })),
];
