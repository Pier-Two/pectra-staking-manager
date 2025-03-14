import { buildFixture } from "../helpers/testing";

type IgnitionModules = Awaited<ReturnType<typeof buildFixture>>;

export type BatchDepositContract = IgnitionModules["batchDeposit"];
