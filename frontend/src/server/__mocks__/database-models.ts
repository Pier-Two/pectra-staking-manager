import { faker } from "@faker-js/faker";
import { DatabaseDocumentStatuses } from "pec/types/app";
import { SUPPORTED_NETWORKS_IDS } from "pec/constants/chain";
import { type Consolidation } from "pec/server/database/classes/consolidation";

// Helper function to generate random txHash
const generateTxHash = () => {
  return faker.string.hexadecimal({ length: 66, prefix: "0x" });
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
    networkId: faker.helpers.arrayElement(SUPPORTED_NETWORKS_IDS),
    amount: faker.number.int({ min: 1, max: 1000000 }),
    ...overrides,
  };
};
