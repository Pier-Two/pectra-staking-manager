import { chunk } from "lodash";
import { CHUNK_SIZE } from "pec/lib/constants";
import { generateErrorResponse } from "pec/lib/utils";
import { type IResponse } from "pec/types/response";

export const chunkRequest = async <Arg, Response>(
  data: Arg[],
  method: (args: Arg[]) => Promise<IResponse<Response[]>>,
  chunkSize: number = CHUNK_SIZE,
): Promise<IResponse<Response[]>> => {
  try {
    const chunkedData = chunk(data, chunkSize);
    const allResponses: Response[] = [];

    for (const chunk of chunkedData) {
      const response = await method(chunk);
      if (!response.success) return response;

      allResponses.push(...response.data);
    }

    return { success: true, data: allResponses };
  } catch (error) {
    return generateErrorResponse(error);
  }
};
