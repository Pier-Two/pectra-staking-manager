/**
 * Formats a validator index by adding commas appropriately to it
 *
 * @param {number} index Index of the validator
 * @returns {string} Formatted validator index
 */
export const formatValidatorIndex = (index: number) => {
  const formatted = new Intl.NumberFormat("en-US").format(index);

  return formatted;
};
