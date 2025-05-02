import { ConsolidationModel } from "pec/server/database/models";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import type { IResponse } from "pec/types/response";
import { sendEmailNotification } from "pec/lib/services/emailService";
import { getValidators } from "../requests/beaconchain/getValidators";
import { type Consolidation } from "pec/server/database/classes/consolidation";
import { type BCValidatorDetails } from "pec/lib/api/schemas/beaconchain/validator";
import { type SupportedNetworkIds } from "pec/constants/chain";
import { keyBy } from "lodash";

interface ProcessConsolidationsParams {
  networkId: SupportedNetworkIds;
  consolidations?: Consolidation[];
  bcValidatorDetails?: BCValidatorDetails[];
}

export const processConsolidations = async ({
  networkId,

  ...overrides
}: ProcessConsolidationsParams): Promise<IResponse> => {
  const consolidations =
    overrides?.consolidations ??
    (await ConsolidationModel.find({ status: ACTIVE_STATUS }));

  let bcValidatorDetails = overrides?.bcValidatorDetails;

  if (!bcValidatorDetails) {
    const getValidatorsResponse = await getValidators(
      consolidations.map((consolidation) => consolidation.sourceValidatorIndex),
      networkId,
    );

    if (!getValidatorsResponse.success) return getValidatorsResponse;

    bcValidatorDetails = getValidatorsResponse.data;
  }

  return processProvidedConsolidations(consolidations, bcValidatorDetails);
};

const processProvidedConsolidations = async (
  consolidations: Consolidation[],
  bcValidatorDetails: BCValidatorDetails[],
): Promise<IResponse> => {
  const keyedBCValidatorDetails = keyBy(
    bcValidatorDetails,
    (v) => v.validatorindex,
  );

  for (const consolidation of consolidations) {
    const bcValidatorDetails =
      keyedBCValidatorDetails[consolidation.sourceValidatorIndex];

    if (!bcValidatorDetails) {
      console.error(
        `No data found when processing consolidations for validator index ${consolidation.sourceValidatorIndex}`,
      );

      continue;
    }

    await checkConsolidationProcessedAndUpdate(
      consolidation,
      bcValidatorDetails,
    );
  }

  return {
    success: true,
    data: null,
  };
};

export const checkConsolidationProcessedAndUpdate = async (
  dbConsolidation: Consolidation,
  bcValidatorDetails: BCValidatorDetails,
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
