import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { ConsolidationModel } from "pec/server/database/models";
import { buildMockConsolidation } from "pec/server/__mocks__/database-models";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import { getValidators } from "pec/server/helpers/requests/beaconchain/getValidators";
import { MAIN_CHAIN } from "pec/lib/constants/contracts";
import { buildMockBCValidatorsData } from "pec/server/__mocks__/validators";
import { sendEmailNotification } from "pec/lib/services/emailService";
import { processConsolidations } from "../consolidation";

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

describe("processConsolidations", () => {
  const sourceValidatorIndex = 100;

  beforeEach(() => {
    mockedGetValidators.mockClear();
    mockedSendEmailNotification.mockClear();
  });

  it("Should update the database record and send an email wheen the consolidation is processed", async () => {
    const knownEmail = "email@email.email";
    const processedConsolidation = buildMockConsolidation({
      status: ACTIVE_STATUS,
      sourceValidatorIndex: sourceValidatorIndex,
      email: knownEmail,
    });
    const unprocessedConsolidation = buildMockConsolidation({
      status: ACTIVE_STATUS,
      sourceValidatorIndex: 200,
    });

    await ConsolidationModel.insertMany([
      processedConsolidation,
      unprocessedConsolidation,
    ]);

    mockedGetValidators.mockResolvedValueOnce({
      success: true,
      data: [
        buildMockBCValidatorsData({
          status: "exited",
          validatorindex: sourceValidatorIndex,
        }),
        buildMockBCValidatorsData({
          status: "active_exiting",
          validatorindex: unprocessedConsolidation.sourceValidatorIndex,
        }),
      ],
    });

    await processConsolidations({ networkId: MAIN_CHAIN.id });

    const updatedConsolidation = await ConsolidationModel.findOne({
      sourceValidatorIndex,
    });

    expect(updatedConsolidation?.status).eq(INACTIVE_STATUS);

    expect(mockedSendEmailNotification).toHaveBeenCalledOnce();
    expect(mockedSendEmailNotification).toBeCalledWith({
      emailName: "PECTRA_STAKING_MANAGER_CONSOLIDATION_COMPLETE",
      metadata: {
        emailAddress: knownEmail,
        targetValidatorIndex: processedConsolidation.targetValidatorIndex,
      },
    });
  });
});
