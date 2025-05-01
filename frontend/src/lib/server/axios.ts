import { HOODI_CHAIN_ID } from "@piertwo/contracts/constants/networks";
import axios from "axios";

import type { SupportedNetworkIds } from "pec/constants/chain";
import { getBeaconChainURL } from "pec/constants/beaconchain";
import { env } from "pec/env";

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

export const CoinMarketCapAxios = axios.create({
  baseURL: "https://pro-api.coinmarketcap.com/v1",
  headers: {
    "X-CMC_PRO_API_KEY": env.COIN_MARKET_CAP_API_KEY,
    "Cache-Control": "max-age=300", // 5 minutes cache
  },
});
