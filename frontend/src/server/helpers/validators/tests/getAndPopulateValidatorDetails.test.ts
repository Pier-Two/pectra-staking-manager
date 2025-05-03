import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { getValidators } from "pec/server/helpers/requests/beaconchain/getValidators";
import {
  buildMockBCValidatorsData,
  generateWithdrawalCredentials,
} from "pec/server/__mocks__/validators";
import { getValidatorsForWithdrawAddress } from "pec/server/helpers/requests/beaconchain/getValidatorForWithdrawAddress";
import {
  buildMockConsolidation,
  buildMockExit,
  buildMockValidatorUpgrade,
} from "pec/server/__mocks__/database-models";
import {
  ConsolidationModel,
  ExitModel,
  ValidatorUpgradeModel,
} from "pec/server/database/models";
import { getAndPopulateValidatorDetails } from "../getAndPopulateValidatorDetails";
import { ISuccessResponse } from "pec/types/response";
import { ValidatorDetails, ValidatorStatus } from "pec/types/validator";
import { ACTIVE_STATUS } from "pec/types/app";
import { TYPE_1_PREFIX } from "pec/constants/pectra";
import { TEST_NETWORK_ID } from "pec/server/__mocks__/constants";

vi.mock("pec/server/helpers/requests/beaconchain/getValidators", () => ({
  getValidators: vi.fn(),
}));

vi.mock(
  "pec/server/helpers/requests/beaconchain/getValidatorForWithdrawAddress",
  () => ({
    getValidatorsForWithdrawAddress: vi.fn(),
  }),
);

const mockedGetValidators = getValidators as Mock<typeof getValidators>;
const mockedGetValidatorsForWithdrawAddress =
  getValidatorsForWithdrawAddress as Mock<
    typeof getValidatorsForWithdrawAddress
  >;

mockedGetValidatorsForWithdrawAddress.mockResolvedValue({
  success: true,
  data: [],
});

describe("getAndPopulateValidatorDetails", () => {
  beforeEach(() => {
    mockedGetValidators.mockClear();
  });

  it("Should return a validator as exited, when they have a pending exit in the DB", async () => {
    const validatorIndex = 50;
    const otherValidatorIndex = 60;

    mockedGetValidators.mockResolvedValueOnce({
      success: true,
      data: [
        buildMockBCValidatorsData({
          status: "active_online",
          validatorindex: validatorIndex,
        }),
        buildMockBCValidatorsData({
          status: "active_online",
          validatorindex: otherValidatorIndex,
        }),
      ],
    });

    await ExitModel.create(
      buildMockExit({ validatorIndex, status: ACTIVE_STATUS }),
    );

    const validatorDetails = (await getAndPopulateValidatorDetails(
      "",
      TEST_NETWORK_ID,
    )) as ISuccessResponse<ValidatorDetails[]>;

    const [exitedValidator, activeValidator] = validatorDetails.data;

    expect(exitedValidator!.status).toEqual(ValidatorStatus.EXITED);
    expect(activeValidator!.status).toEqual(ValidatorStatus.ACTIVE);
  });

  it("Should set pending upgrade on the validator, when they have a pending upgrade in the DB", async () => {
    const validatorIndex = 70;
    const otherValidatorIndex = 80;

    mockedGetValidators.mockResolvedValueOnce({
      success: true,
      data: [
        buildMockBCValidatorsData({
          status: "active_online",
          validatorindex: validatorIndex,
          withdrawalcredentials: generateWithdrawalCredentials(TYPE_1_PREFIX),
        }),
        buildMockBCValidatorsData({
          status: "active_online",
          validatorindex: otherValidatorIndex,
          withdrawalcredentials: generateWithdrawalCredentials(TYPE_1_PREFIX),
        }),
      ],
    });

    await ValidatorUpgradeModel.create(
      buildMockValidatorUpgrade({
        validatorIndex,
        status: ACTIVE_STATUS,
      }),
    );

    const validatorDetails = (await getAndPopulateValidatorDetails(
      "",
      TEST_NETWORK_ID,
    )) as ISuccessResponse<ValidatorDetails[]>;

    const [pendingUpgradeValidator, otherValidator] = validatorDetails.data;

    expect(pendingUpgradeValidator!.pendingUpgrade).toEqual(true);
    expect(otherValidator!.pendingUpgrade).toEqual(false);
  });

  it("Should set the source validator as exited when there is a consolidation for it and add the consolidation to pendingRequests on the target", async () => {
    const sourceValidatorIndex = 90;
    const targetValidatorIndex = 100;

    const sourceValidatorBalance = 32;
    const targetValidatorBalance = 64;

    const sourceValidator = buildMockBCValidatorsData({
      status: "active_online",
      validatorindex: sourceValidatorIndex,
      withdrawalcredentials: generateWithdrawalCredentials(TYPE_1_PREFIX),
      balance: sourceValidatorBalance,
    });
    const targetValidator = buildMockBCValidatorsData({
      status: "active_online",
      validatorindex: targetValidatorIndex,
      balance: targetValidatorBalance,
    });

    mockedGetValidators.mockResolvedValueOnce({
      success: true,
      data: [sourceValidator, targetValidator],
    });

    await ConsolidationModel.create(
      buildMockConsolidation({
        sourceValidatorIndex: sourceValidatorIndex,
        targetValidatorIndex: targetValidatorIndex,
        status: ACTIVE_STATUS,
        amount: sourceValidatorBalance,
      }),
    );

    const validatorDetails = (await getAndPopulateValidatorDetails(
      "",
      TEST_NETWORK_ID,
    )) as ISuccessResponse<ValidatorDetails[]>;

    const [sourceValidatorResponse, targetValidatorResponse] =
      validatorDetails.data;

    expect(sourceValidatorResponse!.status).toEqual(ValidatorStatus.EXITED);
    expect(targetValidatorResponse!.status).toEqual(ValidatorStatus.ACTIVE);

    expect(targetValidatorResponse!.pendingRequests).toEqual([
      {
        type: "consolidation",
        amount: sourceValidatorBalance,
      },
    ]);
    expect(targetValidatorResponse!.pendingBalance).toEqual(
      targetValidatorBalance + sourceValidatorBalance,
    );
  });

  describe("deposits", () => {
    it("Should process a deposit that has been processed and not add it to the pending request array", () => {
      // Check database is updated
    });

    it("Should include a deposit that has been created within the minimum process delay and isn't included in the response from quicknode", () => {});

    it("Should only include a deposit once that is in the database and in the quicknode response", () => {});
  });

  describe("withdrawals", () => {
    it("Should process a withdrawal that has been processed and not add it to the pending request array", () => {
      // Check database is updated
    });

    it("Should include a withdrawal that has been created within the minimum process delay and isn't included in the response from quicknode", () => {});

    it("Should only include a withdrawal once that is in the database and in the quicknode response", () => {});
  });
});
