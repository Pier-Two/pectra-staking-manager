import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { getValidators } from "pec/server/helpers/requests/beaconchain/getValidators";
import { buildMockBCValidatorsData } from "pec/server/__mocks__/validators";
import {
  buildMockConsolidation,
  buildMockExit,
} from "pec/server/__mocks__/database-models";
import { ConsolidationModel, ExitModel } from "pec/server/database/models";
import { type ISuccessResponse } from "pec/types/response";
import { type ValidatorDetails, ValidatorStatus } from "pec/types/validator";
import { ACTIVE_STATUS } from "pec/types/app";
import { TEST_NETWORK_ID } from "pec/server/__mocks__/constants";
import { getAndPopulateExternalValidator } from "../getAndPopulateExternalValidator";

vi.mock("pec/server/helpers/requests/beaconchain/getValidators", () => ({
  getValidators: vi.fn(),
}));

const mockedGetValidators = getValidators as Mock<typeof getValidators>;

describe("getAndPopulateExternalValidator", () => {
  beforeEach(() => {
    mockedGetValidators.mockClear();
  });

  it("Should return a validator as exited, when they have a pending exit in the DB", async () => {
    const validatorIndex = 50;

    mockedGetValidators.mockResolvedValueOnce({
      success: true,
      data: [
        buildMockBCValidatorsData({
          status: "active_online",
          validatorindex: validatorIndex,
        }),
      ],
    });

    await ExitModel.create(
      buildMockExit({ validatorIndex, status: ACTIVE_STATUS }),
    );

    const validatorDetails = (await getAndPopulateExternalValidator(
      "",
      TEST_NETWORK_ID,
    )) as ISuccessResponse<ValidatorDetails>;

    expect(validatorDetails.data.status).toEqual(ValidatorStatus.EXITED);
  });

  it("Should return a validator as exited, when they have a pending consolidation where they are the source", async () => {
    const validatorIndex = 60;

    mockedGetValidators.mockResolvedValueOnce({
      success: true,
      data: [
        buildMockBCValidatorsData({
          status: "active_online",
          validatorindex: validatorIndex,
        }),
      ],
    });

    await ConsolidationModel.create(
      buildMockConsolidation({
        sourceValidatorIndex: validatorIndex,
        status: ACTIVE_STATUS,
      }),
    );

    const validatorDetails = (await getAndPopulateExternalValidator(
      "",
      TEST_NETWORK_ID,
    )) as ISuccessResponse<ValidatorDetails>;

    expect(validatorDetails.data.status).toEqual(ValidatorStatus.EXITED);
  });
});
