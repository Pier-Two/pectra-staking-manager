export interface ITopBar {
  numberOfValidators: number;
  type: ETopBarType;
}

export enum ETopBarType {
  PROFILE = "profile",
  WALLET_CONNECT = "wallet_connect",
}
