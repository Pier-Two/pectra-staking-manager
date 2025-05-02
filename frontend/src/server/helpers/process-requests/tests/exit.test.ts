import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { ExitModel } from "pec/server/database/models";
import { buildMockExit } from "pec/server/__mocks__/database-models";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import { getValidators } from "pec/server/helpers/requests/beaconchain/getValidators";
import { MAIN_CHAIN } from "pec/lib/constants/contracts";
import { buildMockBCValidatorsData } from "pec/server/__mocks__/validators";
import { sendEmailNotification } from "pec/lib/services/emailService";
import { processExits } from "../exits";

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

describe("processExits", () => {
  const validatorIndex = 100;

  beforeEach(() => {
    mockedGetValidators.mockClear();
    mockedSendEmailNotification.mockClear();
  });

  it("Should update the database record and send an email when the exit is processed", async () => {
    const knownEmail = "email@email.email";
    const processedExit = buildMockExit({
      status: ACTIVE_STATUS,
      email: knownEmail,
      validatorIndex,
    });
    const unprocessedExit = buildMockExit({
      status: ACTIVE_STATUS,
    });

    await ExitModel.insertMany([processedExit, unprocessedExit]);

    mockedGetValidators.mockResolvedValueOnce({
      success: true,
      data: [
        buildMockBCValidatorsData({
          status: "exited",
          validatorindex: validatorIndex,
        }),
        buildMockBCValidatorsData({
          status: "active_exiting",
          validatorindex: unprocessedExit.validatorIndex,
        }),
      ],
    });

    await processExits({ networkId: MAIN_CHAIN.id });

    const updatedExit = await ExitModel.findOne({
      validatorIndex,
    });

    expect(updatedExit?.status).eq(INACTIVE_STATUS);

    expect(mockedSendEmailNotification).toHaveBeenCalledOnce();
    expect(mockedSendEmailNotification).toBeCalledWith({
      emailName: "PECTRA_STAKING_MANAGER_WITHDRAWAL_COMPLETE",
      metadata: {
        amount: processedExit.amount,
        emailAddress: knownEmail,
        withdrawalAddress: processedExit.withdrawalAddress,
      },
    });
  });
});
