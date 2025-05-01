import { describe, it, expect } from "vitest";
import { createCaller } from "../../root";
import { validatorSummaries } from "pec/server/__mocks__/charts";
import { ValidatorSummaryModel } from "pec/server/database/models";

const mockCtx = {
  headers: new Headers(),
};

describe("chartRouter", () => {
  it("should return the correct data", async () => {
    await ValidatorSummaryModel.insertMany(validatorSummaries);
    const caller = createCaller(mockCtx);
    const result = await caller.charts.getChartData();
    expect(result).toBeDefined();
  });
});
