/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse, type AxiosRequestConfig } from "axios";
import { type SupportedNetworkIds } from "pec/constants/chain";
import { getBeaconChainAxios, getQuicknodeAxios } from "pec/lib/server/axios";
import { generateErrorResponse } from "pec/lib/utils";
import { type IResponse } from "pec/types/response";
import { type z } from "zod";

/**
 * Parses an axios reesponse using a schema
 * This assumes that the response data is in the format { data: T }
 */
export const executeTypesafeRequest = async <
  TSchema extends z.ZodType<any>,
  TResponseData = z.infer<TSchema>["data"],
>(
  axiosResponse: Promise<AxiosResponse>,
  responseSchema: TSchema,
): Promise<IResponse<TResponseData>> => {
  try {
    const response = await axiosResponse;
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

/**
 * Creates a type-safe API client function that calls a Beaconchain endpoint
 * Assumes the response data is in the format { data: T }
 */
export const executeBeaconChainTypesafeRequest = async <
  TSchema extends z.ZodType<any>,
  TResponseData = z.infer<TSchema>["data"],
>(
  responseSchema: TSchema,
  url: string,
  network: SupportedNetworkIds,
  axiosConfig?: AxiosRequestConfig<any>,
): Promise<IResponse<TResponseData>> => {
  return executeTypesafeRequest(
    getBeaconChainAxios(network).get(url, axiosConfig),
    responseSchema,
  );
};

/**
 * Creates a type-safe API client function that calls a Quicknode endpoint
 * Assumes the response data is in the format { data: T }
 */
export const executeQuicknodeTypesafeRequest = async <
  TSchema extends z.ZodType<any>,
  TResponseData = z.infer<TSchema>["data"],
>(
  responseSchema: TSchema,
  url: string,
  network: SupportedNetworkIds,
  axiosConfig?: AxiosRequestConfig<any>,
): Promise<IResponse<TResponseData>> => {
  return executeTypesafeRequest(
    getQuicknodeAxios(network).get(url, axiosConfig),
    responseSchema,
  );
};
