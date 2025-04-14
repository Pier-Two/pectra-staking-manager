import { ConsolidationModel } from "pec/lib/database/models";
import { generateErrorResponse } from "pec/lib/utils";
import type { IResponse } from "pec/types/response";

export const storeConsolidationRequest = async () => {};

export const processConsolidations = async (
  validatorIndex: number,
  txHash: string,
): Promise<IResponse<null>> => {
  try {
    await ConsolidationModel.create({
      validatorIndex,
      txHash,
    });

    return {
      success: true,
      data: null,
    };
  } catch (err) {
    return generateErrorResponse(err);
  }
};
