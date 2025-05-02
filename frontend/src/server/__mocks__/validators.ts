import {
  VALIDATOR_LIFECYCLE_STATUSES,
  ValidatorStatus,
  WithdrawalAddressPrefixType,
  type ValidatorDetails,
} from "pec/types/validator";
import { faker } from "@faker-js/faker";
import { type BCValidatorDetails } from "pec/lib/api/schemas/beaconchain/validator";

// Helper function to generate random pending request
const generatePendingRequest = () => {
  const requestType = faker.helpers.arrayElement(["consolidation", "deposits"]);
  return {
    type: requestType,
    amount: faker.number.int({ min: 1, max: 10000 }), // Random number between 1 and 10000
  };
};

// Helper function to generate a public key in the required format
export const generatePublicKey = () => {
  return `0x${faker.string.hexadecimal({ length: 64, casing: "lower", prefix: "" })}`;
};

export const generateAddress = () => {
  return `0x${faker.string.hexadecimal({ length: 40, casing: "lower", prefix: "" })}`;
};

// Helper function to generate a withdrawal address in the required format
export const generateWithdrawalCredentials = (
  overridePrefix?: WithdrawalAddressPrefixType,
) => {
  const prefix =
    overridePrefix?.slice(2) ?? faker.helpers.arrayElement(["00", "01", "02"]);
  return `0x${prefix}${faker.string.hexadecimal({ length: 40, casing: "lower", prefix: "" })}`;
};

export const buildMockBCValidatorsData = (
  overrides: Partial<BCValidatorDetails> = {},
): BCValidatorDetails => {
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
    validatorindex: faker.number.int({
      min: 10000000,
      max: 20000000,
    }),
    withdrawableepoch: faker.number.int({ min: 200, max: 1000 }),
    withdrawalcredentials: generateWithdrawalCredentials(),
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
    validatorIndex: faker.number.int({
      min: 10000000,
      max: 20000000,
    }),
    withdrawalAddress: generateWithdrawalCredentials(),
    pendingUpgrade: faker.datatype.boolean(),
    ...overrides,
  };
};

export const buildMockValidatorDetailsArray = (
  length = 10,
  overrides: Partial<ValidatorDetails>[] = [],
): ValidatorDetails[] => {
  return Array.from({ length }, (_, i) => {
    const override = overrides[i] ?? {};
    return buildMockValidatorDetails(override);
  });
};

export const MOCK_VALIDATORS = buildMockValidatorDetailsArray(10);
