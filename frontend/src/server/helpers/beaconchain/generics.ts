/* eslint-disable @typescript-eslint/no-explicit-any */
import { type AxiosRequestConfig } from "axios";
import { type SupportedNetworkIds } from "pec/constants/chain";
import { getBeaconChainAxios } from "pec/lib/server/axios";
import { generateErrorResponse } from "pec/lib/utils";
import { type IResponse } from "pec/types/response";
import { type z } from "zod";

/**
 * Creates a type-safe API client function that calls a Beaconchain endpoint
 *
 * @param responseSchema - The Zod schema to validate the response
 * @param url - The URL of the API endpoint
 * @param network - The network ID to use for the API call
 * @param axiosConfig - Optional Axios request configuration
 * @returns A function that calls the API and returns a typed response
 */
export const executeBeaconchainTypesafeRequest = async <
  TSchema extends z.ZodType<any>,
  TResponseData = z.infer<TSchema>["data"],
>(
  responseSchema: TSchema,
  url: string,
  network: SupportedNetworkIds,
  axiosConfig?: AxiosRequestConfig<any>,
): Promise<IResponse<TResponseData>> => {
  try {
    const response = await getBeaconChainAxios(network).get(url, axiosConfig);
    const parsedData = responseSchema.safeParse(response.data);

    if (!parsedData.success) {
      return generateErrorResponse(parsedData.error);
    }

    return {
      success: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      data: parsedData.data.data,
    };
  } catch (error) {
    console.error("Beaconchain Response failed Zod validation", error);
    return generateErrorResponse(error);
  }
};
