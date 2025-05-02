import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { getValidators } from "pec/server/helpers/requests/beaconchain/getValidators";
import { buildMockBCValidatorsData } from "pec/server/__mocks__/validators";
import { getValidatorsForWithdrawAddress } from "../../requests/beaconchain/getValidatorForWithdrawAddress";
import { buildMockExit } from "pec/server/__mocks__/database-models";
import { ExitModel } from "pec/server/database/models";
import { getAndPopulateValidatorDetails } from "../getAndPopulateValidatorDetails";

vi.mock("pec/server/helpers/requests/beaconchain/getValidators", () => ({
  getValidators: vi.fn(),
}));

vi.mock(
  "pec/server/helpers/requests/beaconchain/getValidatorsForWithdrawAddress",
  () => ({
    getValidatorsForWithdrawAddress: vi.fn(),
  }),
);

const mockedGetValidators = getValidators as Mock<typeof getValidators>;

describe("getAndPopulateValidatorDetails", () => {
  const validatorIndexes = [1, 2, 3];
  const networkId = "mainnet";

  beforeEach(() => {
    mockedGetValidators.mockClear();
  });

  it("Should return a validator as exited, when they have a pending exit in the DB", async () => {
    const validatorIndex = 56;

    mockedGetValidators.mockResolvedValueOnce({
      success: true,
      data: [
        buildMockBCValidatorsData({
          status: "active_online",
          validatorindex: validatorIndex,
        }),
      ],
    });

    await ExitModel.create(buildMockExit({ validatorIndex }));

    const validatorDetails = await getAndPopulateValidatorDetails("", 0);

    expect(getValidators).toHaveBeenCalledWith(validatorIndexes, networkId);
  });
});
