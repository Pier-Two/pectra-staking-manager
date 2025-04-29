import { format, intervalToDuration } from "date-fns";

export const formatDate = (date: Date): string => {
  return format(date, "MMM dd, yyyy");
};

export const getValidatorDurationString = (from: Date, to: Date): string => {
  const duration = intervalToDuration({ start: from, end: to });
  const years = duration.years ?? 0;
  const months = duration.months ?? 0;

  return `${years} year${years !== 1 ? "s" : ""} and ${months} month${months !== 1 ? "s" : ""}`;
};
