import { QNPendingDepositsType } from "pec/lib/api/schemas/quicknode/pendingDeposits";
import { generatePublicKey, generateWithdrawalCredentials } from "./validators";
import { faker } from "@faker-js/faker";
import { QNPendingPartialWithdrawalType } from "pec/lib/api/schemas/quicknode/pendingPartialWithdrawals";

export const buildMockQNPendingDeposit = (
  overrides?: Partial<QNPendingDepositsType>,
): QNPendingDepositsType => {
  return {
    pubkey: generatePublicKey(),
    amount: faker.number.int({ min: 1, max: 100 }),
    signature: faker.string.hexadecimal({ length: 128 }),
    slot: faker.number.int({ min: 1, max: 100 }).toString(),
    withdrawal_credentials: generateWithdrawalCredentials(),
    ...overrides,
  };
};

export const buildMockQNPendingPartialWithdrawal = (
  overrides?: Partial<QNPendingPartialWithdrawalType>,
): QNPendingPartialWithdrawalType => {
  return {
    amount: faker.number.int({ min: 1, max: 100 }),
    validator_index: faker.number.int({ min: 1000000, max: 2000000 }),
    withdrawable_epoch: faker.number.int({ min: 1, max: 100 }).toString(),
    ...overrides,
  };
};
