import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { ValidatorUpgradeModel } from "pec/server/database/models";
import { buildMockValidatorUpgrade } from "pec/server/__mocks__/database-models";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import { getValidators } from "pec/server/helpers/requests/beaconchain/getValidators";
import { MAIN_CHAIN } from "pec/lib/constants/contracts";
import {
  buildMockBCValidatorsData,
  generateWithdrawalCredentials,
} from "pec/server/__mocks__/validators";
import { sendEmailNotification } from "pec/lib/services/emailService";
import { TYPE_1_PREFIX, TYPE_2_PREFIX } from "pec/constants/pectra";
import { processValidatorUpgrades } from "../validatorUpgrade";

vi.mock("pec/server/helpers/requests/beaconchain/getValidators", () => ({
  getValidators: vi.fn(),
}));

vi.mock("pec/lib/services/emailService", () => ({
  sendEmailNotification: vi.fn(),
}));

const mockedGetValidators = getValidators as Mock<typeof getValidators>;
const mockedSendEmailNotification = sendEmailNotification as Mock<
  typeof sendEmailNotification
>;

describe("process validator upgrades", () => {
  const validatorIndex = 100;

  beforeEach(() => {
    mockedGetValidators.mockClear();
    mockedSendEmailNotification.mockClear();
  });

  it("Should update the database record and send an email when the validator upgrade is processed", async () => {
    const knownEmail = "email@email.email";
    const processedValidatorUpgrade = buildMockValidatorUpgrade({
      status: ACTIVE_STATUS,
      email: knownEmail,
      validatorIndex,
    });
    const unprocessValidatorUpgrade = buildMockValidatorUpgrade({
      status: ACTIVE_STATUS,
    });

    await ValidatorUpgradeModel.insertMany([
      processedValidatorUpgrade,
      unprocessValidatorUpgrade,
    ]);

    mockedGetValidators.mockResolvedValueOnce({
      success: true,
      data: [
        buildMockBCValidatorsData({
          // Its not doing a pure match on this address, just checking the prefix
          withdrawalcredentials: generateWithdrawalCredentials(TYPE_2_PREFIX),
          validatorindex: validatorIndex,
        }),
        buildMockBCValidatorsData({
          status: "active_exiting",
          validatorindex: unprocessValidatorUpgrade.validatorIndex,
          withdrawalcredentials: generateWithdrawalCredentials(TYPE_1_PREFIX),
        }),
      ],
    });

    await processValidatorUpgrades({ networkId: MAIN_CHAIN.id });

    const updatedValidatorUpgrade = await ValidatorUpgradeModel.findOne({
      validatorIndex,
    });

    expect(updatedValidatorUpgrade?.status).eq(INACTIVE_STATUS);

    expect(mockedSendEmailNotification).toHaveBeenCalledOnce();
    expect(mockedSendEmailNotification).toBeCalledWith({
      emailName: "PECTRA_STAKING_MANAGER_CONSOLIDATION_COMPLETE",
      metadata: {
        emailAddress: knownEmail,
        targetValidatorIndex: validatorIndex,
      },
    });
  });
});
