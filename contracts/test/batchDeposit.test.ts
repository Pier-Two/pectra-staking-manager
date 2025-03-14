import { testingFixture } from "../helpers/testing";
import { expect } from "chai";

describe("BatchDeposit", () => {
  let batchDeposit: any;

  beforeEach(async () => {
    ({ batchDeposit } = await testingFixture());
  });

  it("Should revert when supplying no deposits", async () => {
    await expect(batchDeposit.batchDeposit([])).to.be.revertedWith(
      "No deposits supplied",
    );
  });
});
