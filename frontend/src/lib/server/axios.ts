import { HOODI_CHAIN_ID } from "@piertwo/contracts/constants/networks";
import axios from "axios";
import type { SupportedNetworkIds } from "pec/constants/chain";
import { env } from "pec/env";
import { MAIN_CHAIN } from "../constants/contracts";

export const getBeaconChainURL = (isTestnet = true): `${string}/` =>
  `https://${isTestnet ? "hoodi." : ""}beaconcha.in/`;

export const HoodiBeaconchainAxios = axios.create({
  baseURL: getBeaconChainURL(true),
  params: {
    apikey: env.BEACONCHAIN_API_KEY,
  },
});

export const MainnetBeaconchainAxios = axios.create({
  baseURL: getBeaconChainURL(false),
  params: {
    apikey: env.BEACONCHAIN_API_KEY,
  },
});

export const getBeaconChainAxios = (network: SupportedNetworkIds) => {
  if (network === HOODI_CHAIN_ID) return HoodiBeaconchainAxios;

  return MainnetBeaconchainAxios;
};

const getQuicknodeURL = (network: SupportedNetworkIds) => {
  if (network === HOODI_CHAIN_ID) {
    return `https://${env.HOODI_QUICKNODE_ENDPOINT_NAME}.quiknode.pro/${env.HOODI_QUICKNODE_ENDPOINT_SECRET}`;
  }

  return `https://${env.QUICKNODE_ENDPOINT_NAME}.quiknode.pro/${env.QUICKNODE_ENDPOINT_SECRET}`;
};

export const HoodiQuicknodeAxios = axios.create({
  baseURL: getQuicknodeURL(HOODI_CHAIN_ID),
});

export const MainnetQuicknodeAxios = axios.create({
  baseURL: getQuicknodeURL(MAIN_CHAIN.id),
});

export const getQuicknodeAxios = (network: SupportedNetworkIds) => {
  if (network === HOODI_CHAIN_ID) return HoodiQuicknodeAxios;

  return MainnetQuicknodeAxios;
};

export const CoinMarketCapAxios = axios.create({
  baseURL: "https://pro-api.coinmarketcap.com/v1",
  headers: {
    "X-CMC_PRO_API_KEY": env.COIN_MARKET_CAP_API_KEY,
    "Cache-Control": "max-age=300", // 5 minutes cache
  },
});
