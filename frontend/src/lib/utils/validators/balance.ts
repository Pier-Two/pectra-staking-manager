import { DECIMAL_PLACES_ETH } from "pec/lib/constants";
import { formatEther } from "viem";

// This function takes in an amount either as a number or bigint and returns a string
// Representing the amount in ETH with the appropriate number of decimal places and in a human readable format
// If the amount is less than the smallest displayable amount, it returns something like "< 0.000001"
export const displayedEthAmount = (amount: number | bigint): string => {
  if (typeof amount === "bigint") amount = Number(formatEther(amount));
  const minDisplayableAmount = Math.pow(10, -DECIMAL_PLACES_ETH);

  return amount >= minDisplayableAmount
    ? amount.toFixed(DECIMAL_PLACES_ETH)
    : `< ${minDisplayableAmount.toFixed(DECIMAL_PLACES_ETH)}`;
};
