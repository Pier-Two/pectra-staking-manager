import { faker } from "@faker-js/faker";
import { DatabaseDocumentStatuses } from "pec/types/app";
import { SUPPORTED_NETWORKS_IDS } from "pec/constants/chain";
import { Consolidation } from "pec/lib/database/classes/consolidation";

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
    targetValidatorIndex: faker.number.int({ min: 1, max: 1000000 }),
    sourceTargetValidatorIndex: faker.number.int({ min: 1, max: 1000000 }),
    txHash: generateTxHash(),
    networkId: faker.helpers.arrayElement(SUPPORTED_NETWORKS_IDS),
    ...overrides,
  };
};
