import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { WithdrawalModel } from "pec/server/database/models";
import { buildMockWithdrawal } from "pec/server/__mocks__/database-models";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import { MAIN_CHAIN } from "pec/lib/constants/contracts";
import { sendEmailNotification } from "pec/lib/services/emailService";
import { buildMockQNPendingPartialWithdrawal } from "pec/server/__mocks__/quicknode";
import { getPendingPartialWithdrawals } from "../../requests/quicknode/getPendingPartialWithdrawals";
import { processPartialWithdrawals } from "../withdrawal";
import { range } from "lodash";

vi.mock(
  "pec/server/helpers/requests/quicknode/getPendingPartialWithdrawals",
  () => ({
    getPendingPartialWithdrawals: vi.fn(),
  }),
);

vi.mock("pec/lib/services/emailService", () => ({
  sendEmailNotification: vi.fn(),
}));

const mockedGetPendingPartialWithdrawals = getPendingPartialWithdrawals as Mock<
  typeof getPendingPartialWithdrawals
>;
const mockedSendEmailNotification = sendEmailNotification as Mock<
  typeof sendEmailNotification
>;

describe("processWithdrawals", { concurrent: false }, () => {
  beforeEach(async () => {
    mockedGetPendingPartialWithdrawals.mockClear();
    mockedSendEmailNotification.mockClear();

    await WithdrawalModel.deleteMany({});
  });

  it("Shouldn't send an email when there is a match", async () => {
    const mockWithdrawal = buildMockWithdrawal({
      status: ACTIVE_STATUS,
      validatorIndex: 2,
      amount: 1,
    });

    await WithdrawalModel.create(mockWithdrawal);

    mockedGetPendingPartialWithdrawals.mockResolvedValueOnce({
      success: true,
      data: [
        buildMockQNPendingPartialWithdrawal({
          validator_index: mockWithdrawal.validatorIndex,
          amount: mockWithdrawal.amount,
        }),
      ],
    });

    await processPartialWithdrawals({ networkId: MAIN_CHAIN.id });

    const updatedWithdrawal = await WithdrawalModel.findOne({
      _id: mockWithdrawal._id,
    });

    expect(updatedWithdrawal?.status).eq(ACTIVE_STATUS);

    expect(mockedSendEmailNotification).not.toHaveBeenCalled();
  });

  it("Should update the database record and send an email when the withdrawal is processed", async () => {
    const mockWithdrawal = buildMockWithdrawal({
      status: ACTIVE_STATUS,
      validatorIndex: 5,
      amount: 1,
    });

    await WithdrawalModel.create(mockWithdrawal);

    mockedGetPendingPartialWithdrawals.mockResolvedValueOnce({
      success: true,
      data: [
        buildMockQNPendingPartialWithdrawal({
          validator_index: 1,
        }),
      ],
    });

    await processPartialWithdrawals({ networkId: MAIN_CHAIN.id });

    const updatedWithdrawal = await WithdrawalModel.findOne({
      _id: mockWithdrawal._id,
    });

    expect(updatedWithdrawal!.status).eq(INACTIVE_STATUS);

    expect(mockedSendEmailNotification).toHaveBeenCalledWith({
      emailName: "PECTRA_STAKING_MANAGER_WITHDRAWAL_COMPLETE",
      metadata: {
        amount: updatedWithdrawal!.amount,
        emailAddress: updatedWithdrawal!.email,
        withdrawalAddress: updatedWithdrawal!.withdrawalAddress,
      },
    });
  });

  it("Should process only a single withdrawal and the oldest withdrawal first when there are duplicate withdrawals", async () => {
    const firstMockWithdrawal = buildMockWithdrawal({
      status: ACTIVE_STATUS,
      validatorIndex: 5,
      amount: 1,
      email: "email@email.email",
      createdAt: new Date("2023-01-01"),
    });

    await WithdrawalModel.create(firstMockWithdrawal);

    const secondMockWithdrawal = buildMockWithdrawal({
      status: ACTIVE_STATUS,
      validatorIndex: firstMockWithdrawal.validatorIndex,
      amount: firstMockWithdrawal.amount,
      email: "other-email@email.email",
      createdAt: new Date("2023-01-02"),
    });

    await WithdrawalModel.create(secondMockWithdrawal);

    mockedGetPendingPartialWithdrawals.mockResolvedValueOnce({
      success: true,
      data: [
        buildMockQNPendingPartialWithdrawal({
          validator_index: firstMockWithdrawal.validatorIndex,
          amount: firstMockWithdrawal.amount,
        }),
      ],
    });

    await processPartialWithdrawals({ networkId: MAIN_CHAIN.id });

    const updatedFirstWithdrawal = await WithdrawalModel.findOne({
      _id: firstMockWithdrawal._id,
    });

    expect(updatedFirstWithdrawal!.status).eq(INACTIVE_STATUS);

    expect(mockedSendEmailNotification).toHaveBeenCalledOnce();

    expect(mockedSendEmailNotification).toHaveBeenCalledWith({
      emailName: "PECTRA_STAKING_MANAGER_WITHDRAWAL_COMPLETE",
      metadata: {
        amount: firstMockWithdrawal.amount,
        emailAddress: firstMockWithdrawal.email,
        withdrawalAddress: firstMockWithdrawal.withdrawalAddress,
      },
    });

    const updatedSecondWithdrawal = await WithdrawalModel.findOne({
      _id: secondMockWithdrawal._id,
    });

    expect(updatedSecondWithdrawal!.status).eq(ACTIVE_STATUS);
  });

  it("Should process all duplicate withdrawals", async () => {
    const mockWithdrawals = range(5).map(() =>
      buildMockWithdrawal({
        status: ACTIVE_STATUS,
        validatorIndex: 52,
        amount: 1,
        email: "email@email.email",
      }),
    );

    await WithdrawalModel.insertMany(mockWithdrawals);

    mockedGetPendingPartialWithdrawals.mockResolvedValueOnce({
      success: true,
      data: [],
    });

    await processPartialWithdrawals({ networkId: MAIN_CHAIN.id });

    const allWithdrawals = await WithdrawalModel.find({
      $or: mockWithdrawals.map((w) => ({ _id: w._id })),
    });

    expect(allWithdrawals.length).eq(5);
    expect(allWithdrawals.every((w) => w.status === INACTIVE_STATUS)).toBe(
      true,
    );
    expect(mockedSendEmailNotification).toHaveBeenCalledTimes(5);
  });
});
