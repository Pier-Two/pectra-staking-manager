import { formatEther } from "viem";

import { DECIMAL_PLACES_ETH } from "pec/lib/constants";

// This function takes in an amount either as a number or bigint and returns a string
// Representing the amount in ETH with the appropriate number of decimal places and in a human readable format
// If the amount is less than the smallest displayable amount, it returns something like "< 0.000001"
export const displayedEthAmount = (
  amount: number | bigint,
  decimals = DECIMAL_PLACES_ETH,
): string => {
  if (typeof amount === "bigint") amount = Number(formatEther(amount));
  const minDisplayableAmount = Math.pow(10, -decimals);

  return amount >= minDisplayableAmount
    ? amount.toFixed(decimals)
    : `< ${minDisplayableAmount.toFixed(decimals)}`;
};
