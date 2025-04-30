import { describe, it, expect } from "vitest";
import { validatorSummaries } from "pec/server/__mocks__/charts";
import { ValidatorSummaryModel } from "pec/lib/database/models";
import { createCaller } from "pec/server/api/root";

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
