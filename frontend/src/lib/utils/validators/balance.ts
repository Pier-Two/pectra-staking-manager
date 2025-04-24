import { DECIMAL_PLACES_ETH } from "pec/lib/constants";

export const displayedEthAmount = (amount: number): string => {
  const minDisplayableAmount = Math.pow(10, -DECIMAL_PLACES_ETH);
  return amount >= minDisplayableAmount
    ? amount.toFixed(DECIMAL_PLACES_ETH)
    : `< ${minDisplayableAmount.toFixed(DECIMAL_PLACES_ETH)}`;
};
