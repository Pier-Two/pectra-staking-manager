import {
  SUPPORTED_NETWORKS_IDS,
  type SupportedNetworkIds,
} from "pec/constants/chain";
import { z } from "zod";

export const SupportedChainIdSchema = z
  .number()
  .refine(
    (val): val is SupportedNetworkIds => SUPPORTED_NETWORKS_IDS.includes(val),
    {
      message: "Unsupported network ID",
    },
  );
