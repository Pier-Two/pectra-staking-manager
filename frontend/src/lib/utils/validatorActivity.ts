import { EPOCH_DURATION_MS, GENESIS_TIMESTAMP } from "pec/constants/api";
import { formatDate, getValidatorDurationString } from "./date";

export const getValidatorActiveInfo = (
  activationEpoch: number,
): { activeSince: string; activeDuration: string } => {
  const activationTimestamp =
    GENESIS_TIMESTAMP + activationEpoch * EPOCH_DURATION_MS;
  const activationDate = new Date(activationTimestamp);
  const now = new Date();

  const activeSince = formatDate(activationDate);
  const activeDuration = getValidatorDurationString(activationDate, now);

  return { activeSince, activeDuration };
};
