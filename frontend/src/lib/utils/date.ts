export const formatDate = (date: Date): string => {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

export const getValidatorDurationString = (from: Date, to: Date): string => {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return `${years} year${years !== 1 ? "s" : ""} and ${months} month${months !== 1 ? "s" : ""}`;
};
