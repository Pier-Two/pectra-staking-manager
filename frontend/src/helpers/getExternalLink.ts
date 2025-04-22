/**
 * Get the block explorer transaction URL
 * @param txHash - The transaction hash
 * @returns The block explorer transaction URL
 */
export const getBlockExplorerTxUrl = (txHash: string | undefined) => {
  if (!txHash) return "";
  return `https://etherscan.io/tx/${txHash}`;
};

/**
 * Open a new tab
 * @param url - The URL to open
 * 
 * @usage onClick={() => openInNewTab(getBlockExplorerTxUrl(txHash))}
 */
export const openInNewTab = (url: string | undefined) => {
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
};
