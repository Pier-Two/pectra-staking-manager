import { type SupportedNetworkIds } from "./chain";

export const GENESIS_TIMESTAMP = 1606824023 * 1000; // Beacon Chain genesis in ms
export const EPOCH_DURATION_MS = 6.4 * 60 * 1000; // 6.4 minutes per epoch
export const WITHDRAWAL_PREFIXES = {
  merge: "0x00",
  shapella: "0x01",
  pectra: "0x02",
};

// hoodi testnet activation timestamp source (genesis)
// https://github.com/eth-clients/hoodi

export const ACTIVATION_TIMESTAMPS_FOR_CHAIN: Record<
  SupportedNetworkIds,
  number
> = {
  1: 1438269973 * 1000,
  560048: 1742213400 * 1000,
};
