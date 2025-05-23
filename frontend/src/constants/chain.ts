import { type ChainOptions, mainnet } from "thirdweb/chains";

export const HOODI_CHAIN_DETAILS: Readonly<
  ChainOptions & {
    rpc: string;
  }
> = {
  name: "Hoodi testnet",
  rpc: "https://0xrpc.io/hoodi",
  id: 560048,
  nativeCurrency: {
    name: "Hoodi",
    symbol: "ETH",
    decimals: 18,
  },
} as const;

export const SUPPORTED_CHAINS: Readonly<ChainOptions & { rpc: string }>[] = [
  mainnet,
  HOODI_CHAIN_DETAILS,
] as const;

export const SUPPORTED_NETWORKS_IDS = [
  HOODI_CHAIN_DETAILS.id,
  mainnet.id,
] as const;

export type SupportedNetworkIds = (typeof SUPPORTED_NETWORKS_IDS)[number];
