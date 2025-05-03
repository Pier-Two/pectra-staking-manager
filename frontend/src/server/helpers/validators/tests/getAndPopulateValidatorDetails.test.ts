import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { getValidators } from "pec/server/helpers/requests/beaconchain/getValidators";
import {
  buildMockBCValidatorsData,
  generateAddress,
  generateWithdrawalCredentials,
} from "pec/server/__mocks__/validators";
import { getValidatorsForWithdrawAddress } from "pec/server/helpers/requests/beaconchain/getValidatorForWithdrawAddress";
import {
  buildMockConsolidation,
  buildMockDeposit,
  buildMockExit,
  buildMockValidatorUpgrade,
  buildMockWithdrawal,
  generateObjectId,
} from "pec/server/__mocks__/database-models";
import {
  ConsolidationModel,
  DepositModel,
  ExitModel,
  ValidatorUpgradeModel,
  WithdrawalModel,
} from "pec/server/database/models";
import { getAndPopulateValidatorDetails } from "../getAndPopulateValidatorDetails";
import { ISuccessResponse } from "pec/types/response";
import { ValidatorDetails, ValidatorStatus } from "pec/types/validator";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import { TYPE_1_PREFIX } from "pec/constants/pectra";
import { TEST_NETWORK_ID } from "pec/server/__mocks__/constants";
import { getPendingDeposits } from "pec/server/helpers/requests/quicknode/getPendingDeposits";
import { sendEmailNotification } from "pec/server/helpers/emails/emailService";
import {
  buildMockQNPendingDeposit,
  buildMockQNPendingPartialWithdrawal,
} from "pec/server/__mocks__/quicknode";
import { getPendingPartialWithdrawals } from "../../requests/quicknode/getPendingPartialWithdrawals";

vi.mock("pec/server/helpers/requests/beaconchain/getValidators", () => ({
  getValidators: vi.fn(),
}));

vi.mock(
  "pec/server/helpers/requests/beaconchain/getValidatorForWithdrawAddress",
  () => ({
    getValidatorsForWithdrawAddress: vi.fn(),
  }),
);
vi.mock("pec/server/helpers/requests/quicknode/getPendingDeposits", () => ({
  getPendingDeposits: vi.fn(),
}));
vi.mock(
  "pec/server/helpers/requests/quicknode/getPendingPartialWithdrawals",
  () => ({
    getPendingPartialWithdrawals: vi.fn(),
  }),
);
vi.mock("pec/server/helpers/emails/emailService", () => ({
  sendEmailNotification: vi.fn(),
}));

const mockedGetValidators = getValidators as Mock<typeof getValidators>;
const mockedGetValidatorsForWithdrawAddress =
  getValidatorsForWithdrawAddress as Mock<
    typeof getValidatorsForWithdrawAddress
  >;
const mockedGetPendingDeposits = getPendingDeposits as Mock<
  typeof getPendingDeposits
>;
const mockedGetPendingPartialWithdrawals = getPendingPartialWithdrawals as Mock<
  typeof getPendingPartialWithdrawals
>;
const mockedSendEmailNotification = sendEmailNotification as Mock<
  typeof sendEmailNotification
>;

mockedGetValidatorsForWithdrawAddress.mockResolvedValue({
  success: true,
  data: [],
});
mockedSendEmailNotification.mockResolvedValue();

describe("getAndPopulateValidatorDetails", () => {
  beforeEach(async () => {
    await Promise.all([
      ExitModel.deleteMany({}),
      DepositModel.deleteMany({}),
      WithdrawalModel.deleteMany({}),
      ConsolidationModel.deleteMany({}),
      ValidatorUpgradeModel.deleteMany({}),
    ]);
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
    it("Should process a deposit that has been processed and not add it to the pending request array", async () => {
      const address = generateAddress();

      const validator = buildMockBCValidatorsData({
        status: "active_online",
        validatorindex: 50,
      });

      mockedGetValidators.mockResolvedValueOnce({
        success: true,
        data: [validator],
      });

      const _id = generateObjectId();
      await DepositModel.create(
        buildMockDeposit({
          _id,
          withdrawalAddress: address,
          status: ACTIVE_STATUS,
          deposits: [
            {
              publicKey: validator.pubkey,
              amount: 32,
              validatorIndex: validator.validatorindex,
            },
          ],
        }),
      );

      mockedGetPendingDeposits.mockResolvedValueOnce({
        success: true,
        data: [],
      });

      const validatorDetails = (await getAndPopulateValidatorDetails(
        address,
        TEST_NETWORK_ID,
      )) as ISuccessResponse<ValidatorDetails[]>;

      const [processedDepositValidator] = validatorDetails.data;

      expect(processedDepositValidator!.pendingRequests).toEqual([]);

      const updatedDeposit = await DepositModel.findOne({
        _id,
      });
      expect(updatedDeposit!.status).eq(INACTIVE_STATUS);
    });

    it("Should include a deposit that has been created within the minimum process delay and isn't included in the response from quicknode", async () => {
      const address = generateAddress();
      const validator = buildMockBCValidatorsData({
        status: "active_online",
        validatorindex: 50,
      });

      mockedGetValidators.mockResolvedValueOnce({
        success: true,
        data: [validator],
      });

      const _id = generateObjectId();
      const depositAmount = 32;
      await DepositModel.create(
        buildMockDeposit({
          _id,
          withdrawalAddress: address,
          status: ACTIVE_STATUS,
          createdAt: new Date(),
          deposits: [
            {
              publicKey: validator.pubkey,
              amount: depositAmount,
              validatorIndex: validator.validatorindex,
            },
          ],
        }),
      );
      mockedGetPendingDeposits.mockResolvedValueOnce({
        success: true,
        data: [],
      });

      const validatorDetails = (await getAndPopulateValidatorDetails(
        address,
        TEST_NETWORK_ID,
      )) as ISuccessResponse<ValidatorDetails[]>;

      const [processedDepositValidator] = validatorDetails.data;

      expect(processedDepositValidator!.pendingRequests).toEqual([
        { type: "deposits", amount: depositAmount },
      ]);
      expect(processedDepositValidator!.pendingBalance).toEqual(
        processedDepositValidator!.balance + depositAmount,
      );

      const updatedDeposit = await DepositModel.findOne({
        _id,
      });
      expect(updatedDeposit!.status).eq(ACTIVE_STATUS);
    });

    it("Should only include a deposit once that is in the database and in the quicknode response", async () => {
      const address = generateAddress();
      const validator = buildMockBCValidatorsData({
        status: "active_online",
        validatorindex: 50,
      });

      mockedGetValidators.mockResolvedValueOnce({
        success: true,
        data: [validator],
      });

      const _id = generateObjectId();
      const depositAmount = 32;
      await DepositModel.create(
        buildMockDeposit({
          _id,
          withdrawalAddress: address,
          status: ACTIVE_STATUS,
          deposits: [
            {
              publicKey: validator.pubkey,
              amount: depositAmount,
              validatorIndex: validator.validatorindex,
            },
          ],
        }),
      );

      mockedGetPendingDeposits.mockResolvedValueOnce({
        success: true,
        data: [
          buildMockQNPendingDeposit({
            amount: depositAmount,
            pubkey: validator.pubkey,
          }),
        ],
      });

      const validatorDetails = (await getAndPopulateValidatorDetails(
        address,
        TEST_NETWORK_ID,
      )) as ISuccessResponse<ValidatorDetails[]>;

      const [processedDepositValidator] = validatorDetails.data;

      expect(processedDepositValidator!.pendingRequests).toEqual([
        { type: "deposits", amount: depositAmount },
      ]);
      expect(processedDepositValidator!.pendingBalance).toEqual(
        processedDepositValidator!.balance + depositAmount,
      );

      const updatedDeposit = await DepositModel.findOne({
        _id,
      });
      expect(updatedDeposit!.status).eq(ACTIVE_STATUS);
    });

    it("Should include a duplicate deposit, one that was created within the minimum process delay and another that is still pending", async () => {
      const address = generateAddress();
      const validator = buildMockBCValidatorsData({
        status: "active_online",
        validatorindex: 50,
      });

      mockedGetValidators.mockResolvedValueOnce({
        success: true,
        data: [validator],
      });

      const _id = generateObjectId();
      const depositAmount = 32;
      await DepositModel.create(
        buildMockDeposit({
          _id,
          withdrawalAddress: address,
          status: ACTIVE_STATUS,
          deposits: [
            {
              publicKey: validator.pubkey,
              amount: depositAmount,
              validatorIndex: validator.validatorindex,
            },
          ],
        }),
        buildMockDeposit({
          createdAt: new Date(),
          withdrawalAddress: address,
          status: ACTIVE_STATUS,
          deposits: [
            {
              publicKey: validator.pubkey,
              amount: depositAmount,
              validatorIndex: validator.validatorindex,
            },
          ],
        }),
      );

      mockedGetPendingDeposits.mockResolvedValueOnce({
        success: true,
        data: [
          buildMockQNPendingDeposit({
            amount: depositAmount,
            pubkey: validator.pubkey,
          }),
        ],
      });

      const validatorDetails = (await getAndPopulateValidatorDetails(
        address,
        TEST_NETWORK_ID,
      )) as ISuccessResponse<ValidatorDetails[]>;

      const [processedDepositValidator] = validatorDetails.data;

      expect(processedDepositValidator!.pendingRequests).toEqual([
        { type: "deposits", amount: depositAmount },
        { type: "deposits", amount: depositAmount },
      ]);
      expect(processedDepositValidator!.pendingBalance).toEqual(
        processedDepositValidator!.balance + depositAmount * 2,
      );
    });

    it("Should include a deposit that isn't in our database but is in the quicknode response", async () => {
      const address = generateAddress();
      const validator = buildMockBCValidatorsData({
        status: "active_online",
        validatorindex: 50,
      });

      mockedGetValidators.mockResolvedValueOnce({
        success: true,
        data: [validator],
      });

      const depositAmount = 32;

      mockedGetPendingDeposits.mockResolvedValueOnce({
        success: true,
        data: [
          buildMockQNPendingDeposit({
            amount: depositAmount,
            pubkey: validator.pubkey,
          }),
        ],
      });

      // Create an empty deposit in the database, so that the `deposits.length > 0` check passes
      await DepositModel.create(
        buildMockDeposit({
          withdrawalAddress: address,
          status: ACTIVE_STATUS,
          deposits: [],
        }),
      );

      const validatorDetails = (await getAndPopulateValidatorDetails(
        address,
        TEST_NETWORK_ID,
      )) as ISuccessResponse<ValidatorDetails[]>;

      const [processedDepositValidator] = validatorDetails.data;

      expect(processedDepositValidator!.pendingRequests).toEqual([
        { type: "deposits", amount: depositAmount },
      ]);
      expect(processedDepositValidator!.pendingBalance).toEqual(
        processedDepositValidator!.balance + depositAmount,
      );
    });
  });

  describe("withdrawals", () => {
    it("Should process a withdrawal that has been processed and not add it to the pending request array", async () => {
      const address = generateAddress();

      const validator = buildMockBCValidatorsData({
        status: "active_online",
        validatorindex: 50,
      });

      mockedGetValidators.mockResolvedValueOnce({
        success: true,
        data: [validator],
      });

      const _id = generateObjectId();
      await WithdrawalModel.create(
        buildMockWithdrawal({
          _id,
          validatorIndex: validator.validatorindex,
          withdrawalAddress: address,
          status: ACTIVE_STATUS,
        }),
      );

      mockedGetPendingPartialWithdrawals.mockResolvedValueOnce({
        success: true,
        data: [],
      });

      const populatedValidatorDetailsResponse =
        (await getAndPopulateValidatorDetails(
          address,
          TEST_NETWORK_ID,
        )) as ISuccessResponse<ValidatorDetails[]>;

      const [validatorDetails] = populatedValidatorDetailsResponse.data;

      expect(validatorDetails!.pendingRequests).toEqual([]);

      const updatedWithdrawals = await WithdrawalModel.findOne({
        _id,
      });
      expect(updatedWithdrawals!.status).eq(INACTIVE_STATUS);
    });

    it("Should include a withdrawal that has been created within the minimum process delay and isn't included in the response from quicknode", async () => {
      const address = generateAddress();
      const balance = 64;
      const validator = buildMockBCValidatorsData({
        status: "active_online",
        validatorindex: 50,
        balance,
      });

      mockedGetValidators.mockResolvedValueOnce({
        success: true,
        data: [validator],
      });

      const _id = generateObjectId();
      const withdrawalAmount = 32;
      await WithdrawalModel.create(
        buildMockWithdrawal({
          _id,
          validatorIndex: validator.validatorindex,
          withdrawalAddress: address,
          status: ACTIVE_STATUS,
          createdAt: new Date(),
          amount: withdrawalAmount,
        }),
      );
      mockedGetPendingPartialWithdrawals.mockResolvedValueOnce({
        success: true,
        data: [],
      });

      const populatedValidatorDetailsResponse =
        (await getAndPopulateValidatorDetails(
          address,
          TEST_NETWORK_ID,
        )) as ISuccessResponse<ValidatorDetails[]>;

      const [validatorDetails] = populatedValidatorDetailsResponse.data;

      expect(validatorDetails!.pendingRequests).toEqual([
        { type: "withdrawals", amount: withdrawalAmount },
      ]);
      expect(validatorDetails!.balance).toEqual(balance - withdrawalAmount);
    });

    it.only("Should only include a withdrawal once that is in the database and in the quicknode response", async () => {
      const address = generateAddress();
      const balance = 64;
      const validator = buildMockBCValidatorsData({
        status: "active_online",
        validatorindex: 50,
        balance,
      });

      mockedGetValidators.mockResolvedValueOnce({
        success: true,
        data: [validator],
      });

      const _id = generateObjectId();
      const withdrawalAmount = 32;
      await WithdrawalModel.create(
        buildMockWithdrawal({
          _id,
          validatorIndex: validator.validatorindex,
          withdrawalAddress: address,
          status: ACTIVE_STATUS,
          amount: withdrawalAmount,
        }),
      );

      mockedGetPendingPartialWithdrawals.mockResolvedValueOnce({
        success: true,
        data: [
          buildMockQNPendingPartialWithdrawal({
            amount: withdrawalAmount,
            validator_index: validator.validatorindex,
          }),
        ],
      });

      const populatedValidatorDetailsResponse =
        (await getAndPopulateValidatorDetails(
          address,
          TEST_NETWORK_ID,
        )) as ISuccessResponse<ValidatorDetails[]>;

      const [validatorDetails] = populatedValidatorDetailsResponse.data;

      expect(validatorDetails!.pendingRequests).toEqual([
        { type: "withdrawals", amount: withdrawalAmount },
      ]);
    });

    it("Should include a duplicate withdrawal, one that was created within the minimum process delay and another that is still pending", async () => {
      const address = generateAddress();
      const balance = 64;

      const validator = buildMockBCValidatorsData({
        status: "active_online",
        validatorindex: 50,
        balance,
      });

      mockedGetValidators.mockResolvedValueOnce({
        success: true,
        data: [validator],
      });

      const _id = generateObjectId();

      const withdrawalAmount = 32;
      await WithdrawalModel.create(
        buildMockWithdrawal({
          _id,
          validatorIndex: validator.validatorindex,
          withdrawalAddress: address,
          status: ACTIVE_STATUS,
          amount: withdrawalAmount,
        }),
        buildMockWithdrawal({
          createdAt: new Date(),
          validatorIndex: validator.validatorindex,
          withdrawalAddress: address,
          status: ACTIVE_STATUS,
          amount: withdrawalAmount,
        }),
      );

      mockedGetPendingPartialWithdrawals.mockResolvedValueOnce({
        success: true,
        data: [
          buildMockQNPendingPartialWithdrawal({
            amount: withdrawalAmount,
            validator_index: validator.validatorindex,
          }),
        ],
      });

      const populatedValidatorDetailsResponse =
        (await getAndPopulateValidatorDetails(
          address,
          TEST_NETWORK_ID,
        )) as ISuccessResponse<ValidatorDetails[]>;

      const [validatorDetails] = populatedValidatorDetailsResponse.data;

      expect(validatorDetails!.pendingRequests).toEqual([
        { type: "withdrawals", amount: withdrawalAmount },
        { type: "withdrawals", amount: withdrawalAmount },
      ]);
      expect(validatorDetails!.balance).toEqual(balance - withdrawalAmount * 2);
    });

    it("Should include a withdrawal that isn't in our database but is in the quicknode response", async () => {
      const address = generateAddress();
      const balance = 64;
      const validator = buildMockBCValidatorsData({
        status: "active_online",
        validatorindex: 50,
        balance,
      });

      mockedGetValidators.mockResolvedValueOnce({
        success: true,
        data: [validator],
      });

      const withdrawalAmount = 32;

      mockedGetPendingPartialWithdrawals.mockResolvedValueOnce({
        success: true,
        data: [
          buildMockQNPendingPartialWithdrawal({
            amount: withdrawalAmount,
            validator_index: validator.validatorindex,
          }),
        ],
      });

      // Create an empty withdrawal in the database, so that the `withdrawals.length > 0` check passes
      await WithdrawalModel.create(
        buildMockWithdrawal({
          validatorIndex: validator.validatorindex,
          status: ACTIVE_STATUS,
        }),
      );

      const populatedValidatorDetailsResponse =
        (await getAndPopulateValidatorDetails(
          address,
          TEST_NETWORK_ID,
        )) as ISuccessResponse<ValidatorDetails[]>;

      const [validatorDetails] = populatedValidatorDetailsResponse.data;

      expect(validatorDetails!.pendingRequests).toEqual([
        { type: "withdrawals", amount: withdrawalAmount },
      ]);
    });
  });
});
