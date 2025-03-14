import { testingFixture } from "../helpers/testing";
import { BatchDepositContract } from "../types/testing";
import { expect } from "chai";

describe("BatchDeposit", () => {
  let batchDeposit: BatchDepositContract;

  beforeEach(async () => {
    ({ batchDeposit } = await testingFixture());
  });

  it("Should revert when supplying no deposits", async () => {
    await expect(
      batchDeposit.write.batchDeposit([[]]),
    ).to.be.revertedWithCustomError(batchDeposit, "NoDepositsProvided");
  });
});
