import { faker } from "@faker-js/faker";
import { DatabaseDocumentStatuses } from "pec/types/app";
import { type Consolidation } from "pec/server/database/classes/consolidation";
import { Exit } from "../database/classes/exit";
import { generateAddress } from "./validators";
import { ValidatorUpgrade } from "../database/classes/validatorUpgrade";
import { Deposit } from "../database/classes/deposit";
import { Withdrawal } from "../database/classes/withdrawal";
import { ObjectId } from "mongodb";
import { DocumentWithId } from "pec/types/database";
import { TEST_NETWORK_ID } from "./constants";

// Helper function to generate random txHash
const generateTxHash = () => {
  return faker.string.hexadecimal({ length: 66, prefix: "0x" });
};

export const generateObjectId = () => {
  return new ObjectId(faker.string.hexadecimal({ length: 24, prefix: "" }));
};

// Function to generate random consolidation data
export const buildMockConsolidation = (
  overrides: Partial<Consolidation> = {},
): Consolidation => {
  return {
    email: faker.internet.email(),
    status: faker.helpers.arrayElement(Object.values(DatabaseDocumentStatuses)),
    // Ensure these don't overlap and are large so we can pass known values in the tests
    targetValidatorIndex: faker.number.int({
      min: 10000000,
      max: 20000000,
    }),
    sourceValidatorIndex: faker.number.int({
      min: 20000000,
      max: 30000000,
    }),
    txHash: generateTxHash(),
    networkId: TEST_NETWORK_ID,
    amount: faker.number.int({ min: 1, max: 1000000 }),
    ...overrides,
  };
};

export const buildMockExit = (overrides: Partial<Exit> = {}): Exit => {
  return {
    email: faker.internet.email(),
    status: faker.helpers.arrayElement(Object.values(DatabaseDocumentStatuses)),
    withdrawalAddress: generateAddress(),
    validatorIndex: faker.number.int({ min: 1, max: 1000000 }),
    txHash: generateTxHash(),
    networkId: TEST_NETWORK_ID,
    amount: faker.number.int({ min: 1, max: 1000000 }),
    ...overrides,
  };
};
export const buildMockValidatorUpgrade = (
  overrides: Partial<ValidatorUpgrade> = {},
): ValidatorUpgrade => {
  return {
    email: faker.internet.email(),
    status: faker.helpers.arrayElement(Object.values(DatabaseDocumentStatuses)),
    validatorIndex: faker.number.int({ min: 1, max: 1000000 }),
    txHash: generateTxHash(),
    networkId: TEST_NETWORK_ID,
    ...overrides,
  };
};

export const buildMockDeposit = (
  overrides: Partial<DocumentWithId<Deposit>> = {},
): DocumentWithId<Deposit> => {
  return {
    _id: generateObjectId(),
    email: faker.internet.email(),
    status: faker.helpers.arrayElement(Object.values(DatabaseDocumentStatuses)),
    deposits: [
      {
        publicKey: faker.string.hexadecimal({ length: 96, prefix: "0x" }),
        validatorIndex: faker.number.int({ min: 1, max: 1000000 }),
        amount: faker.number.int({ min: 1, max: 1000000 }),
      },
    ],
    txHash: generateTxHash(),
    networkId: TEST_NETWORK_ID,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    withdrawalAddress: generateAddress(),
    ...overrides,
  };
};

export const buildMockWithdrawal = (
  overrides: Partial<DocumentWithId<Withdrawal>> = {},
): DocumentWithId<Withdrawal> => {
  return {
    _id: new ObjectId(faker.string.hexadecimal({ length: 24, prefix: "" })),
    email: faker.internet.email(),
    status: faker.helpers.arrayElement(Object.values(DatabaseDocumentStatuses)),
    txHash: generateTxHash(),
    networkId: TEST_NETWORK_ID,
    amount: faker.number.int({ min: 1, max: 1000000 }),
    validatorIndex: faker.number.int({ min: 1000000, max: 2000000 }),
    withdrawalAddress: generateAddress(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...overrides,
  };
};
