import { z } from "zod";

import type { SupportedNetworkIds } from "pec/constants/chain";
import { SUPPORTED_NETWORKS_IDS } from "pec/constants/chain";

export const SupportedChainIdSchema = z
  .number()
  .refine(
    (val): val is SupportedNetworkIds => SUPPORTED_NETWORKS_IDS.includes(val),
    {
      message: "Unsupported network ID",
    },
  );
