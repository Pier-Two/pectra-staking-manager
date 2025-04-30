import { SupportedNetworkIds } from "pec/constants/chain";
import { getBeaconChainAxios } from "pec/lib/server/axios";
import { generateErrorResponse } from "pec/lib/utils";
import { IResponse } from "pec/types/response";
import { z } from "zod";

/**
 * Creates a type-safe API client function that calls a Beaconchain endpoint
 *
 * @param responseSchema - The Zod schema to validate the response
 * @param url - The URL of the API endpoint
 * @param network - The network ID to use for the API call
 * @returns A function that calls the API and returns a typed response
 */
export const executeBeaconchainTypesafeRequest = async <
  TSchema extends z.ZodType<any>,
  TResponseData = z.infer<TSchema>["data"],
>(
  responseSchema: TSchema,
  url: string,
  network: SupportedNetworkIds,
): Promise<IResponse<TResponseData>> => {
  try {
    const response = await getBeaconChainAxios(network).get(url);
    const parsedData = responseSchema.safeParse(response.data);

    if (!parsedData.success) {
      return generateErrorResponse(parsedData.error);
    }

    return {
      success: true,
      data: parsedData.data.data,
    };
  } catch (error) {
    console.error("Beaconchain Response failed Zod validation", error);
    return generateErrorResponse(error);
  }
};
