import { BEACONCHAIN_OK_STATUS } from "pec/lib/constants";
import { z } from "zod";

export const buildBeaconchainResponseSchema = <T>(dataSchema: z.ZodType<T>) =>
  z.object({
    status: z.literal(BEACONCHAIN_OK_STATUS),
    data: dataSchema,
  });
