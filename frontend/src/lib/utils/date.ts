import { format, intervalToDuration } from "date-fns";

export const formatDate = (date: Date): string => {
  return format(date, "MMM dd, yyyy");
};

/**
 * Formats a duration between two dates into a human-readable string.
 * Shows years and months if duration is >= 1 month, otherwise shows days.
 * @param from - Start date
 * @param to - End date
 * @returns Formatted duration string
 */
export const getValidatorDurationString = (from: Date, to: Date): string => {
  const duration = intervalToDuration({ start: from, end: to });
  const years = duration.years ?? 0;
  const months = duration.months ?? 0;
  const days = duration.days ?? 0;

  // If duration is less than a month, show days
  if (years === 0 && months === 0) {
    return `${days} day${days !== 1 ? "s" : ""}`;
  }

  // Show years and months for longer durations
  return `${years} year${years !== 1 ? "s" : ""} and ${months} month${months !== 1 ? "s" : ""}`;
};
