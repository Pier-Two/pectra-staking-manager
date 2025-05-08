import {
  ACTIVATION_TIMESTAMPS_FOR_CHAIN,
  EPOCH_DURATION_MS,
} from "pec/constants/api";
import { formatDate, getValidatorDurationString } from "../date";
import { type SupportedNetworkIds } from "pec/constants/chain";

export const getValidatorActiveInfo = (
  activationEpoch: number,
  network: SupportedNetworkIds,
): { activeSince: string; activeDuration: string } => {
  const chainActivationTimestamp = ACTIVATION_TIMESTAMPS_FOR_CHAIN[network];

  if (!chainActivationTimestamp) {
    throw new Error(`No activation timestamp defined for chain ID ${network}`);
  }

  const activationTimestamp =
    chainActivationTimestamp + activationEpoch * EPOCH_DURATION_MS;

  const activationDate = new Date(activationTimestamp);
  const now = new Date();

  const activeSince = formatDate(activationDate);
  const activeDuration = getValidatorDurationString(activationDate, now);

  return { activeSince, activeDuration };
};
