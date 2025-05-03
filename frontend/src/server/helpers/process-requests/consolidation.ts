import { ConsolidationModel } from "pec/server/database/models";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import type { IResponse } from "pec/types/response";
import { sendEmailNotification } from "pec/server/helpers/emails/emailService";
import { getValidators } from "../requests/beaconchain/getValidators";
import { type Consolidation } from "pec/server/database/classes/consolidation";
import { type BCValidatorDetails } from "pec/lib/api/schemas/beaconchain/validator";
import { type SupportedNetworkIds } from "pec/constants/chain";
import { keyBy } from "lodash";
import { getLogger } from "../logger";
import { DocumentWithId } from "pec/types/database";
import { Types } from "mongoose";

const logger = getLogger();

interface ProcessConsolidationsParams {
  networkId: SupportedNetworkIds;
  consolidations?: DocumentWithId<Consolidation>[];
  bcValidatorDetails?: BCValidatorDetails[];
}

export const processConsolidations = async ({
  networkId,

  ...overrides
}: ProcessConsolidationsParams): Promise<IResponse> => {
  const consolidations =
    overrides?.consolidations ??
    (await ConsolidationModel.find({ status: ACTIVE_STATUS, networkId }));

  if (consolidations.length === 0) return { success: true, data: null };

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
  consolidations: DocumentWithId<Consolidation>[],
  bcValidatorDetails: BCValidatorDetails[],
): Promise<IResponse> => {
  const keyedBCValidatorDetails = keyBy(
    bcValidatorDetails,
    (v) => v.validatorindex,
  );

  const consolidationIdsToUpdate: Types.ObjectId[] = [];

  for (const consolidation of consolidations) {
    const bcValidatorDetails =
      keyedBCValidatorDetails[consolidation.sourceValidatorIndex];

    if (!bcValidatorDetails) {
      console.error(
        `No data found when processing consolidations for validator index ${consolidation.sourceValidatorIndex}`,
      );

      continue;
    }

    if (bcValidatorDetails.status === "exited") {
      logger.info(
        `Consolidation for validator index ${consolidation.sourceValidatorIndex} is complete.`,
      );

      consolidationIdsToUpdate.push(consolidation._id);

      await sendEmailNotification({
        emailName: "PECTRA_STAKING_MANAGER_CONSOLIDATION_COMPLETE",
        metadata: {
          emailAddress: consolidation.email,
          targetValidatorIndex: consolidation.targetValidatorIndex,
        },
      });
    }
  }

  await ConsolidationModel.updateMany(
    {
      _id: { $in: consolidationIdsToUpdate },
    },
    {
      $set: { status: INACTIVE_STATUS },
    },
  );

  return {
    success: true,
    data: null,
  };
};
