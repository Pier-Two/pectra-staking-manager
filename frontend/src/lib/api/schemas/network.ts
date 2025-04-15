import {
  SUPPORTED_NETWORKS_IDS,
  SupportedNetworkIds,
} from "pec/constants/chain";
import { z } from "zod";

export const SupportedNetworkSchema = z
  .number()
  .refine(
    (val): val is SupportedNetworkIds =>
      SUPPORTED_NETWORKS_IDS.includes(val as SupportedNetworkIds),
    {
      message: "Unsupported network ID",
    },
  );
