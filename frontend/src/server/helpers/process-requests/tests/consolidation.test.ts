import { describe, it, expect, vi, Mock } from "vitest";
import { validatorSummaries } from "pec/server/__mocks__/charts";
import {
  ConsolidationModel,
  ValidatorSummaryModel,
} from "pec/server/database/models";
import { createCaller } from "pec/server/api/root";
import { Consolidation } from "pec/server/database/classes/consolidation";
import { buildMockConsolidation } from "pec/server/__mocks__/database-models";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import { getValidators } from "../../beaconchain/getValidators";
import { processConsolidations } from "../consolidation";

const mockCtx = {
  headers: new Headers(),
};

vi.mock("../../beaconchain/getValidators", () => ({
  getValidators: vi.fn(),
}));

type MockedGetValidators = Mock<typeof getValidators>;

describe("processConsolidations", () => {
  it("should return the correct data", async () => {
    // const result = vi.fn<typeof getValidators>(getValidators);

    // getValidators.mockReturnValue(
    //   Promise.resolve({
    //     success: true,
    //     data: ["hey"] as any,
    //   }),
    // );
    // Define what the mock should return
    (getValidators as MockedGetValidators).mockResolvedValue({
      success: true,
      data: [
        { validatorId: "123", status: "active" },
        { validatorId: "456", status: "inactive" },
      ] as any,
    });

    console.log(await getValidators([], 1));

    const consolidations = buildMockConsolidation({ status: ACTIVE_STATUS });
    await ConsolidationModel.insertMany(consolidations);
    const returned = await ConsolidationModel.find();
    console.log("Consolidations: ", returned);
    const caller = createCaller(mockCtx);
    await processConsolidations();
    // const result = await calle;
    // expect(result).toBeDefined();
  });
});
