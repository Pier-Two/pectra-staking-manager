import { ConsolidationModel } from "pec/server/database/models";
import { generateErrorResponse } from "pec/lib/utils";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import type { IResponse } from "pec/types/response";
import { sendEmailNotification } from "pec/lib/services/emailService";
import { getValidators } from "../beaconchain/getValidators";
import { type Consolidation } from "pec/server/database/classes/consolidation";
import { type BCValidatorsData } from "pec/lib/api/schemas/beaconchain/validator";
import { type SupportedNetworkIds } from "pec/constants/chain";

export const checkConsolidationProcessedAndUpdate = async (
  dbConsolidation: Consolidation,
  bcValidatorDetails: BCValidatorsData,
): Promise<boolean> => {
  if (bcValidatorDetails.status === "exited") {
    await ConsolidationModel.updateOne(
      {
        sourceValidatorIndex: dbConsolidation.sourceValidatorIndex,
      },
      { $set: { status: INACTIVE_STATUS } },
    );

    await sendEmailNotification({
      emailName: "PECTRA_STAKING_MANAGER_CONSOLIDATION_COMPLETE",
      metadata: {
        emailAddress: dbConsolidation.email,
        targetValidatorIndex: dbConsolidation.targetValidatorIndex,
      },
    });

    return true;
  }

  return false;
};

export const processConsolidations = async (
  networkId: SupportedNetworkIds,
): Promise<IResponse> => {
  try {
    const consolidations = await ConsolidationModel.find({
      status: ACTIVE_STATUS,
    });

    if (!consolidations)
      return {
        success: false,
        error: "Consolidation query failed to execute.",
      };

    // TODO: This can be better and make a single DB call
    for (const consolidation of consolidations) {
      const response = await getValidators(
        [consolidation.sourceValidatorIndex],
        networkId,
      );

      if (!response.success) return response;

      const consolidationData = response.data;

      const [consolidationDataResponse] = consolidationData;

      if (!consolidationDataResponse) {
        console.error(
          `No data found for validator index ${consolidation.sourceValidatorIndex}`,
        );

        continue;
      }

      await checkConsolidationProcessedAndUpdate(
        consolidation,
        consolidationDataResponse,
      );
    }

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return generateErrorResponse(error);
  }
};
