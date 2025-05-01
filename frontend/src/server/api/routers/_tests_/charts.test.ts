import { describe, expect, it } from "vitest";

import { ValidatorSummaryModel } from "pec/lib/database/models";
import { validatorSummaries } from "pec/test-data/validatorSummaries";

import { createCaller } from "../../root";

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
