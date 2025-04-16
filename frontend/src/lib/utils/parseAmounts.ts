import { formatEther } from "viem";
import { DECIMAL_PLACES } from "../constants";

export const parseEtherToFixedDecimals = (
  amountInEther: bigint,
  decimals = DECIMAL_PLACES,
) => {
  return Number(formatEther(amountInEther)).toFixed(decimals);
};
