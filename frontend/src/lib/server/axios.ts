import { HOODI_CHAIN_ID } from "@piertwo/contracts/constants/networks";
import axios from "axios";
import { getBeaconChainURL } from "pec/constants/beaconchain";
import { SupportedNetworkIds } from "pec/constants/chain";
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
