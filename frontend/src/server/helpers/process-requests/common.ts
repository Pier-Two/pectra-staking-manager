// 10 minutes
const MINIMUM_PROCESS_DELAY_MS = 10 * 60 * 1000;

// This is used as a delay before we process withdrawals and deposits
// Because we check if the deposit exists in an array of pending deposits on Beaconchain, we want to allow sufficient delay for the request to propagate and not to accidentally mark it as complete
export const getMinimumProcessDelay = () =>
  new Date(Date.now() - MINIMUM_PROCESS_DELAY_MS);
