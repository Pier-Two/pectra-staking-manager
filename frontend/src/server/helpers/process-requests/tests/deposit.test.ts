import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { DepositModel } from "pec/server/database/models";
import { buildMockDeposit } from "pec/server/__mocks__/database-models";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import { sendEmailNotification } from "pec/server/helpers/emails/emailService";
import { buildMockQNPendingDeposit } from "pec/server/__mocks__/quicknode";
import { sumBy } from "lodash";
import { getPendingDeposits } from "../../requests/quicknode/getPendingDeposits";
import { processDeposits } from "../deposit";
import { TEST_NETWORK_ID } from "pec/server/__mocks__/constants";

vi.mock("pec/server/helpers/requests/quicknode/getPendingDeposits", () => ({
  getPendingDeposits: vi.fn(),
}));

vi.mock("pec/server/helpers/emails/emailService", () => ({
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
    const mockDeposit = buildMockDeposit({
      status: ACTIVE_STATUS,
      deposits: [
        {
          publicKey: publicKey,
          amount,
          validatorIndex: 1,
        },
      ],
      txHash: "0x123",
      createdAt: new Date("2023-01-01"),
    });

    await DepositModel.create(mockDeposit);

    mockedGetPendingDeposits.mockResolvedValueOnce({
      success: true,
      data: [
        buildMockQNPendingDeposit({
          pubkey: publicKey,
          amount,
        }),
      ],
    });

    await processDeposits({ networkId: TEST_NETWORK_ID });

    const updatedDeposit = await DepositModel.findOne({
      _id: mockDeposit._id,
    });

    expect(updatedDeposit?.status).eq(ACTIVE_STATUS);

    expect(mockedSendEmailNotification).not.toHaveBeenCalled();
  });

  it("Shouldn't process a deposit that has been created before the minimum process delay", async () => {
    const pubKey = "0x111";
    const amount = 1;

    const mockDeposit = buildMockDeposit({
      status: ACTIVE_STATUS,
      deposits: [
        {
          publicKey: pubKey,
          amount,
          validatorIndex: 1,
        },
      ],
      txHash: "0x123",
      createdAt: new Date(),
    });

    await DepositModel.create(mockDeposit);

    mockedGetPendingDeposits.mockResolvedValueOnce({
      success: true,
      data: [],
    });

    await processDeposits({ networkId: TEST_NETWORK_ID });

    const updatedDeposit = await DepositModel.findOne({
      _id: mockDeposit._id,
    });

    expect(updatedDeposit?.status).eq(ACTIVE_STATUS);
  });

  it("Should update the database record and send an email when the deposit is processed", async () => {
    const publicKey = "0x111";
    const amount = 100;
    const mockDeposit = buildMockDeposit({
      status: ACTIVE_STATUS,
      deposits: [
        { publicKey: publicKey, amount, validatorIndex: 1 },
        { publicKey: "0x222", amount: 500, validatorIndex: 2 },
      ],
      txHash: "0x123",
    });

    await DepositModel.create(mockDeposit);

    mockedGetPendingDeposits.mockResolvedValueOnce({
      success: true,
      data: [],
    });

    await processDeposits({ networkId: TEST_NETWORK_ID });

    const updatedDeposit = await DepositModel.findOne({
      _id: mockDeposit._id,
    });

    expect(updatedDeposit!.status).eq(INACTIVE_STATUS);

    const totalAmount = sumBy(updatedDeposit!.deposits, (d) => d.amount);

    expect(mockedSendEmailNotification).toHaveBeenCalledOnce();

    expect(mockedSendEmailNotification).toHaveBeenCalledWith({
      emailName: "PECTRA_STAKING_MANAGER_DEPOSIT_COMPLETE",
      metadata: {
        emailAddress: updatedDeposit!.email,
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

    await processDeposits({ networkId: TEST_NETWORK_ID });

    const updatedDeposit = await DepositModel.findOne({
      _id: firstMockDeposit._id,
    });

    expect(updatedDeposit!.status).eq(INACTIVE_STATUS);
    expect(mockedSendEmailNotification).toHaveBeenCalledOnce();

    const updatedSecondDeposit = await DepositModel.findOne({
      _id: secondMockDeposit._id,
    });

    expect(updatedSecondDeposit!.status).eq(ACTIVE_STATUS);
  });

  it("Should be able to process multiple duplicate deposits and send an email for each", async () => {
    const publicKey = "0x234";
    const amount = 100;
    const firstMockDeposit = buildMockDeposit({
      status: ACTIVE_STATUS,
      deposits: [{ publicKey, amount, validatorIndex: 1 }],
      createdAt: new Date("2023-01-01"),
    });

    await DepositModel.create(firstMockDeposit);

    const secondMockDeposit = buildMockDeposit({
      status: ACTIVE_STATUS,
      deposits: [{ publicKey, amount, validatorIndex: 1 }],
      createdAt: new Date("2023-01-02"),
    });
    await DepositModel.create(secondMockDeposit);

    mockedGetPendingDeposits.mockResolvedValueOnce({
      success: true,
      data: [],
    });

    await processDeposits({ networkId: TEST_NETWORK_ID });

    const updatedFirstDeposit = await DepositModel.findOne({
      _id: firstMockDeposit._id,
    });

    expect(updatedFirstDeposit!.status).eq(INACTIVE_STATUS);

    const updatedSecondDeposit = await DepositModel.findOne({
      _id: secondMockDeposit._id,
    });

    expect(updatedSecondDeposit!.status).eq(INACTIVE_STATUS);

    expect(mockedSendEmailNotification).toHaveBeenCalledTimes(2);
  });

  it("Should only send a single email when multiple deposits are processed in the same batch", async () => {
    const publicKey = "0x234";
    const amount = 100;
    const mockDeposit = buildMockDeposit({
      status: ACTIVE_STATUS,
      deposits: [
        { publicKey, amount, validatorIndex: 1 },
        { publicKey: "0x346", amount: 200, validatorIndex: 2 },
        { publicKey: "0x347", amount: 200, validatorIndex: 2 },
        { publicKey: "0x348", amount: 200, validatorIndex: 2 },
        { publicKey: "0x349", amount: 200, validatorIndex: 2 },
      ],
      createdAt: new Date("2023-01-01"),
    });

    await DepositModel.create(mockDeposit);

    mockedGetPendingDeposits.mockResolvedValueOnce({
      success: true,
      data: [],
    });

    await processDeposits({ networkId: TEST_NETWORK_ID });

    expect(mockedSendEmailNotification).toHaveBeenCalledOnce();
  });
});
