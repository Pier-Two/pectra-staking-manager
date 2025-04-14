export const getBeaconChainURL = (isTestnet = true): `${string}/` =>
  `https://${isTestnet ? "hoodi." : ""}beaconcha.in/`;
