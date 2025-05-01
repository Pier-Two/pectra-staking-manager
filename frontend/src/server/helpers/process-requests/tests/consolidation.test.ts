import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { ConsolidationModel } from "pec/server/database/models";
import { buildMockConsolidation } from "pec/server/__mocks__/database-models";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import { getValidators } from "../../requests/beaconchain/getValidators";
import { processConsolidations } from "../consolidation";
import { MAIN_CHAIN } from "pec/lib/constants/contracts";
import { buildMockBCValidatorsData } from "pec/server/__mocks__/validators";
import { sendEmailNotification } from "pec/lib/services/emailService";

vi.mock("../../beaconchain/getValidators", () => ({
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
  beforeEach(() => {
    mockedGetValidators.mockClear();
    mockedSendEmailNotification.mockClear();
  });

  it("Should update the database record and send an email wheen the consolidation is processed", async () => {
    const sourceValidatorIndex = 100;

    const consolidation = buildMockConsolidation({
      status: ACTIVE_STATUS,
      sourceValidatorIndex: sourceValidatorIndex,
    });

    await ConsolidationModel.insertOne(consolidation);

    mockedGetValidators.mockResolvedValue({
      success: true,
      data: [
        buildMockBCValidatorsData({
          status: "exited",
          validatorindex: sourceValidatorIndex,
        }),
      ],
    });

    await processConsolidations(MAIN_CHAIN.id);

    const updatedConsolidation = await ConsolidationModel.findOne({
      sourceValidatorIndex,
    });

    expect(updatedConsolidation?.status).eq(INACTIVE_STATUS);

    expect(mockedSendEmailNotification).toBeCalledWith({
      emailName: "PECTRA_STAKING_MANAGER_CONSOLIDATION_COMPLETE",
      metadata: {
        emailAddress: consolidation.email,
        targetValidatorIndex: consolidation.targetValidatorIndex,
      },
    });
  });
});
