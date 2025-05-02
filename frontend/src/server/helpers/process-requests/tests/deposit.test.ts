import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { DepositModel } from "pec/server/database/models";
import { buildMockDeposit } from "pec/server/__mocks__/database-models";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import { MAIN_CHAIN } from "pec/lib/constants/contracts";
import { sendEmailNotification } from "pec/lib/services/emailService";
import { buildMockQNPendingDeposit } from "pec/server/__mocks__/quicknode";
import { sumBy } from "lodash";
import { getPendingDeposits } from "../../requests/quicknode/getPendingDeposits";
import { processDeposits } from "../deposit";

vi.mock("pec/server/helpers/requests/quicknode/getPendingDeposits", () => ({
  getPendingDeposits: vi.fn(),
}));

vi.mock("pec/lib/services/emailService", () => ({
  sendEmailNotification: vi.fn(),
}));

const mockedGetPendingDeposits = getPendingDeposits as Mock<
  typeof getPendingDeposits
>;
const mockedSendEmailNotification = sendEmailNotification as Mock<
  typeof sendEmailNotification
>;

describe("processDeposits", { concurrent: false }, () => {
  beforeEach(async () => {
    mockedGetPendingDeposits.mockClear();
    mockedSendEmailNotification.mockClear();

    await DepositModel.deleteMany({});
  });

  it("Shouldn't send an email when there is a match", async () => {
    const publicKey = "0x111";
    const amount = 1;
    const mockWithdrawal = buildMockDeposit({
      status: ACTIVE_STATUS,
      deposits: [{ publicKey: publicKey, amount, validatorIndex: 1 }],
      txHash: "0x123",
    });

    await DepositModel.create(mockWithdrawal);

    mockedGetPendingDeposits.mockResolvedValueOnce({
      success: true,
      data: [
        buildMockQNPendingDeposit({
          pubkey: publicKey,
          amount,
        }),
      ],
    });

    await processDeposits({ networkId: MAIN_CHAIN.id });

    const updatedDeposit = await DepositModel.findOne({
      _id: mockWithdrawal._id,
    });

    expect(updatedDeposit?.status).eq(ACTIVE_STATUS);

    expect(mockedSendEmailNotification).not.toHaveBeenCalled();
  });

  it("Should update the database record and send an email when the deposit is processed", async () => {
    const publicKey = "0x111";
    const amount = 100;
    const mockWithdrawal = buildMockDeposit({
      status: ACTIVE_STATUS,
      deposits: [
        { publicKey: publicKey, amount, validatorIndex: 1 },
        { publicKey: "0x222", amount: 500, validatorIndex: 2 },
      ],
      txHash: "0x123",
    });

    await DepositModel.create(mockWithdrawal);

    mockedGetPendingDeposits.mockResolvedValueOnce({
      success: true,
      data: [],
    });

    await processDeposits({ networkId: MAIN_CHAIN.id });

    const updatedWithdrawal = await DepositModel.findOne({
      _id: mockWithdrawal._id,
    })!;

    expect(updatedWithdrawal!.status).eq(INACTIVE_STATUS);

    const totalAmount = sumBy(updatedWithdrawal!.deposits, (d) => d.amount);

    expect(mockedSendEmailNotification).toHaveBeenCalledOnce();

    expect(mockedSendEmailNotification).toHaveBeenCalledWith({
      emailName: "PECTRA_STAKING_MANAGER_DEPOSIT_COMPLETE",
      metadata: {
        emailAddress: updatedWithdrawal!.email,
        totalAmount,
      },
    });
  });

  it("Should process only a single deposit and the oldest deposit first when there are duplicate deposits", async () => {
    const publicKey = "0x234";
    const amount = 100;
    const firstMockDeposit = buildMockDeposit({
      status: ACTIVE_STATUS,
      deposits: [{ publicKey: publicKey, amount, validatorIndex: 1 }],
      createdAt: new Date("2023-01-01"),
    });

    await DepositModel.create(firstMockDeposit);

    const secondMockDeposit = buildMockDeposit({
      status: ACTIVE_STATUS,
      deposits: [{ publicKey: publicKey, amount, validatorIndex: 1 }],
      createdAt: new Date("2023-01-02"),
    });
    await DepositModel.create(secondMockDeposit);

    mockedGetPendingDeposits.mockResolvedValueOnce({
      success: true,
      data: [
        buildMockQNPendingDeposit({
          pubkey: publicKey,
          amount,
        }),
      ],
    });

    await processDeposits({ networkId: MAIN_CHAIN.id });

    const updatedWithdrawal = await DepositModel.findOne({
      _id: firstMockDeposit._id,
    })!;

    expect(updatedWithdrawal!.status).eq(INACTIVE_STATUS);
    expect(mockedSendEmailNotification).toHaveBeenCalledOnce();

    const updatedSecondWithdrawal = await DepositModel.findOne({
      _id: secondMockDeposit._id,
    })!;

    expect(updatedSecondWithdrawal!.status).eq(ACTIVE_STATUS);
  });
});
