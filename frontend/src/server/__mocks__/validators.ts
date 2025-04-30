import {
  VALIDATOR_LIFECYCLE_STATUSES,
  ValidatorStatus,
  type ValidatorDetails,
} from "pec/types/validator";
import { faker } from "@faker-js/faker";
import { BCValidatorsData } from "pec/lib/api/schemas/beaconchain/validator";

// Helper function to generate random pending request
const generatePendingRequest = () => {
  const requestType = faker.helpers.arrayElement(["consolidation", "deposits"]);
  return {
    type: requestType,
    amount: faker.number.int({ min: 1, max: 10000 }), // Random number between 1 and 10000
  };
};

// Helper function to generate a public key in the required format
const generatePublicKey = () => {
  return `0x${faker.string.hexadecimal({ length: 64 }).slice(2)}`;
};

// Helper function to generate a withdrawal address in the required format
const generateWithdrawalAddress = () => {
  const prefix = faker.helpers.arrayElement(["00", "01", "02"]);
  return `0x${prefix}${faker.string.hexadecimal({ length: 40 }).slice(2)}`;
};

export const buildMockBCValidatorsData = (
  overrides: Partial<BCValidatorsData> = {},
): BCValidatorsData => {
  return {
    activationeligibilityepoch: faker.number.int({ min: 1, max: 100 }),
    activationepoch: faker.number.int({ min: 1, max: 100 }),
    balance: faker.number.int({ min: 1000, max: 50000 }),
    effectivebalance: faker.number.int({ min: 1000, max: 50000 }),
    exitepoch: faker.number.int({ min: 100, max: 500 }),
    lastattestationslot: faker.number.int({ min: 1, max: 10000 }),
    name: faker.name.firstName() + " Validator",
    pubkey: generatePublicKey(),
    slashed: faker.datatype.boolean(),
    status: faker.helpers.arrayElement(VALIDATOR_LIFECYCLE_STATUSES),
    validatorindex: faker.number.int({ min: 1, max: 1000000 }),
    withdrawableepoch: faker.number.int({ min: 200, max: 1000 }),
    withdrawalcredentials: generateWithdrawalAddress(),
    total_withdrawals: faker.number.int({ min: 0, max: 100 }),
    ...overrides,
  };
};

// Function to generate validator data using Faker
export const buildMockValidatorDetails = (
  overrides: Partial<ValidatorDetails> = {},
): ValidatorDetails => {
  return {
    activeDuration: `${faker.number.int({ min: 1, max: 100 })} days`,
    activeSince: faker.date.past().toISOString(),
    balance: faker.number.int({ min: 0, max: 10000 }),
    pendingRequests: [generatePendingRequest(), generatePendingRequest()],
    effectiveBalance: faker.number.int({ min: 0, max: 10000 }),
    numberOfWithdrawals: faker.number.int({ min: 0, max: 100 }),
    publicKey: generatePublicKey(),
    status: faker.helpers.arrayElement(Object.values(ValidatorStatus)),
    validatorIndex: faker.number.int({ min: 1, max: 1000000 }),
    withdrawalAddress: generateWithdrawalAddress(),
    pendingUpgrade: faker.datatype.boolean(),
    ...overrides,
  };
};

export const buildMockValidatorDetailsArray = (
  length = 10,
  overrides: Partial<ValidatorDetails>[] = [],
): ValidatorDetails[] => {
  return Array.from({ length }, (_, i) => {
    const override = overrides[i] || {};
    return buildMockValidatorDetails(override);
  });
};

export const MOCK_VALIDATORS: ValidatorDetails[] = [
  {
    validatorIndex: 499086,
    publicKey:
      "0x017103eb09b42c5937b406fc66a467756c8c9200714dd6fb9e3641710d0a7f002bf36e3a18bf4c066438738957074c99",
    withdrawalAddress:
      "0x010000000000000000000000278b5e51d0b5f5aa92ac7b5cabf76dd2f86a0917",
    balance: 32,
    effectiveBalance: 33,
    numberOfWithdrawals: 0,
    status: ValidatorStatus.ACTIVE,
    activeSince: "01-Jan-2025",
    activeDuration: "100 days",
    consolidationTransaction: undefined,
    depositTransaction: undefined,
    withdrawalTransactions: [],
    hasPendingDeposit: false,
    upgradeSubmitted: false,
  },
  {
    validatorIndex: 501234,
    publicKey:
      "0x020ab1f9c56784de9b69c9155e2f6a8c3df9287ac54e96b3623eb1a4a2c39e87b43f6d2a18bf4c066438738957074c99",
    withdrawalAddress:
      "0x0200000000000000000000003f5cbd1b7e673b1e67c5f94e58972bcd1e8a0917",
    balance: 31.5,
    effectiveBalance: 32,
    numberOfWithdrawals: 1,
    status: ValidatorStatus.ACTIVE,
    activeSince: "15-Feb-2025",
    activeDuration: "85 days",
    consolidationTransaction: undefined,
    depositTransaction: undefined,
    withdrawalTransactions: [],
    hasPendingDeposit: false,
    upgradeSubmitted: false,
  },
  {
    validatorIndex: 502890,
    publicKey:
      "0x020caf23b9a24d3c89f42c5f83e90b94fc50d8328ae67231d29df65b1b479d678af36e3a18bf4c066438738957074c99",
    withdrawalAddress:
      "0x0200000000000000000000004a7e9f813b52981b5f9e21a7d9d3b9c49e8a0917",
    balance: 32,
    effectiveBalance: 32,
    numberOfWithdrawals: 0,
    status: ValidatorStatus.PENDING,
    activeSince: "20-Mar-2025",
    activeDuration: "50 days",
    consolidationTransaction: undefined,
    depositTransaction: undefined,
    withdrawalTransactions: [],
    hasPendingDeposit: false,
    upgradeSubmitted: false,
  },
  {
    validatorIndex: 503452,
    publicKey:
      "0x010ecf71e6e32a5d6b81f30a672c91f2458c9e9af412b8f1cbf50a7d7b678f024b36e3a18bf4c066438738957074c99",
    withdrawalAddress:
      "0x0100000000000000000000001d3e2a19b5c3a6a4e9f4c8b2e3d9f8b7e8a0917",
    balance: 33.1,
    effectiveBalance: 33,
    numberOfWithdrawals: 2,
    status: ValidatorStatus.ACTIVE,
    activeSince: "20-Mar-2025",
    activeDuration: "50 days",
    consolidationTransaction: undefined,
    depositTransaction: undefined,
    withdrawalTransactions: [],
    hasPendingDeposit: false,
    upgradeSubmitted: false,
  },
  {
    validatorIndex: 504321,
    publicKey:
      "0x020de834a9b567d3c8a42e5f91e90c92fc50d8328ae67231d29df65b1b479d678af36e3a18bf4c066438738957074c99",
    withdrawalAddress:
      "0x0200000000000000000000002b7d9f831b52981b5f9e21a7d9d3b9c49e8a0917",
    balance: 31.8,
    effectiveBalance: 32,
    numberOfWithdrawals: 0,
    status: ValidatorStatus.INACTIVE,
    activeSince: "10-Jan-2025",
    activeDuration: "120 days",
    consolidationTransaction: undefined,
    depositTransaction: undefined,
    withdrawalTransactions: [],
    hasPendingDeposit: false,
    upgradeSubmitted: false,
  },
  ...Array.from({ length: 15 }, (_, i) => ({
    validatorIndex: 500000 + i,
    publicKey: `0x01${Math.random().toString(14).slice(2, 66)}`,
    withdrawalAddress: `0x01${i}000000000000000000000278b5e51d0b5f5aa92ac7b5cabf76dd2f86a0917`,
    balance: Math.random() * 1,
    effectiveBalance: Math.random() * 1,
    numberOfWithdrawals: Math.floor(Math.random() * 10),
    status:
      i < 15
        ? ValidatorStatus.ACTIVE
        : i < 19
          ? ValidatorStatus.PENDING
          : ValidatorStatus.INACTIVE,
    activeSince: i < 15 ? "2023-06-15" : "2025-01-01",
    activeDuration: i < 15 ? "8 months" : "3 months",
    consolidationTransaction: undefined,
    depositTransaction: undefined,
    withdrawalTransactions: [],
    hasPendingDeposit: false,
    upgradeSubmitted: false,
  })),
];
