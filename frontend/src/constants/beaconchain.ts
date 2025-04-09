export const getBeaconChainURL = (isTestnet: boolean): `${string}/` =>
  `https://${isTestnet && "hoodi."}beaconcha.in/`;
