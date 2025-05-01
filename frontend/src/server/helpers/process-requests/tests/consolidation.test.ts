import { describe, it, vi, Mock } from "vitest";
import { ConsolidationModel } from "pec/server/database/models";
import { buildMockConsolidation } from "pec/server/__mocks__/database-models";
import { ACTIVE_STATUS } from "pec/types/app";
import { getValidators } from "../../beaconchain/getValidators";
import { processConsolidations } from "../consolidation";
import { MAIN_CHAIN } from "pec/lib/constants/contracts";
import { buildMockBCValidatorsData } from "pec/server/__mocks__/validators";

vi.mock("../../beaconchain/getValidators", () => ({
  getValidators: vi.fn(),
}));

type MockedGetValidators = Mock<typeof getValidators>;

describe("processConsolidations", () => {
  it("Should update the database record and send an email wheen the consolidation is processed", async () => {
    // const result = vi.fn<typeof getValidators>(getValidators);

    // getValidators.mockReturnValue(
    //   Promise.resolve({
    //     success: true,
    //     data: ["hey"] as any,
    //   }),
    // );
    // Define what the mock should return
    //
    const sourceValidatorIndex = 100;

    const consolidations = buildMockConsolidation({
      status: ACTIVE_STATUS,
      sourceValidatorIndex: sourceValidatorIndex,
    });

    await ConsolidationModel.insertMany(consolidations);

    (getValidators as MockedGetValidators).mockResolvedValue({
      success: true,
      data: [
        buildMockBCValidatorsData({
          status: "exited",
          validatorindex: sourceValidatorIndex,
        }),
      ],
    });

    await processConsolidations(MAIN_CHAIN.id);
  });
});
