import { type BCValidatorDetails } from "pec/lib/api/schemas/beaconchain/validator";
import { sendEmailNotification } from "pec/server/helpers/emails/emailService";
import { type Exit } from "pec/server/database/classes/exit";
import { ExitModel } from "pec/server/database/models";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import { getValidators } from "../requests/beaconchain/getValidators";
import { SupportedNetworkIds } from "pec/constants/chain";
import { IResponse } from "pec/types/response";
import { keyBy } from "lodash";
import { DocumentWithId } from "pec/types/database";
import { Types } from "mongoose";
import { logger } from "../logger";

interface ProcessAllExitsParams {
  networkId: SupportedNetworkIds;
  exits?: DocumentWithId<Exit>[];
  bcValidatorDetails?: BCValidatorDetails[];
}

export const processExits = async ({
  networkId,

  ...overrides
}: ProcessAllExitsParams): Promise<IResponse> => {
  const exits =
    overrides?.exits ??
    (await ExitModel.find({ status: ACTIVE_STATUS, networkId }));

  if (exits.length === 0) return { success: true, data: null };

  let bcValidatorDetails = overrides?.bcValidatorDetails;

  if (!bcValidatorDetails) {
    const getValidatorsResponse = await getValidators(
      exits.map((exit) => exit.validatorIndex),
      networkId,
    );

    if (!getValidatorsResponse.success) return getValidatorsResponse;

    bcValidatorDetails = getValidatorsResponse.data;
  }

  return processProvidedExits(exits, bcValidatorDetails);
};

const processProvidedExits = async (
  exits: DocumentWithId<Exit>[],
  bcValidatorDetails: BCValidatorDetails[],
): Promise<IResponse> => {
  const keyedBCValidatorDetails = keyBy(
    bcValidatorDetails,
    (v) => v.validatorindex,
  );

  const exitsIdsToUpdate: Types.ObjectId[] = [];

  for (const exit of exits) {
    const bcValidatorDetails = keyedBCValidatorDetails[exit.validatorIndex];

    if (!bcValidatorDetails) {
      logger.error(`No data found for validator index ${exit.validatorIndex}`);

      continue;
    }

    if (bcValidatorDetails.status === "exited") {
      logger.info(
        `Exit for validator index ${exit.validatorIndex} has been processed`,
      );

      exitsIdsToUpdate.push(exit._id);

      await sendEmailNotification({
        emailName: "PECTRA_STAKING_MANAGER_WITHDRAWAL_COMPLETE",
        metadata: {
          amount: exit.amount,
          emailAddress: exit.email,
          withdrawalAddress: exit.withdrawalAddress,
        },
      });
    }
  }

  await ExitModel.updateMany(
    { _id: { $in: exitsIdsToUpdate } },
    { $set: { status: INACTIVE_STATUS } },
  );

  return {
    success: true,
    data: null,
  };
};
