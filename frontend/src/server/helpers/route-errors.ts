import { TRPCError } from "@trpc/server";
import { IResponse } from "pec/types/response";

// Helper that maps our internal IResponse type to TRPCError for consistency
export const routeHandler = async <T>(
  routeMethod: () => Promise<IResponse<T>>,
): Promise<T> => {
  try {
    const response = await routeMethod();

    if (!response.success) {
      console.error("Error in route handler:", response.error);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch validators",
        cause: response.error,
      });
    }

    return response.data;
  } catch (error) {
    console.error("Error in route handler:", error);
    throw error;
  }
};
