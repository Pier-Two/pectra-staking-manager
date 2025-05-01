import { HOODI_CHAIN_ID } from "@piertwo/contracts/constants/networks";
import { HOODI_CHAIN_DETAILS, SupportedNetworkIds } from "pec/constants/chain";

/**
 * Get the block explorer transaction URL
 * @param txHash - The transaction hash
 * @returns The block explorer transaction URL
 */
export const getBlockExplorerTxUrl = (
  txHash: string,
  networkId: SupportedNetworkIds,
) => {
  const prefix = networkId === HOODI_CHAIN_DETAILS.id ? "hoodi." : "";
  return `https://${prefix}etherscan.io/tx/${txHash}`;
};

export const labrysUrl = `https://labrys.io/`;

export const pierTwoUrl = `https://piertwo.com/`;

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

