import { type BCValidatorDetails } from "pec/lib/api/schemas/beaconchain/validator";
import { sendEmailNotification } from "pec/server/helpers/emails/emailService";
import { type Exit } from "pec/server/database/classes/exit";
import { ExitModel } from "pec/server/database/models";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import { getValidators } from "../requests/beaconchain/getValidators";
import { SupportedNetworkIds } from "pec/constants/chain";
import { IResponse } from "pec/types/response";
import { keyBy } from "lodash";
import { getLogger } from "../logger";

const logger = getLogger();

interface ProcessAllExitsParams {
  networkId: SupportedNetworkIds;
  exits?: Exit[];
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
  exits: Exit[],
  bcValidatorDetails: BCValidatorDetails[],
): Promise<IResponse> => {
  const keyedBCValidatorDetails = keyBy(
    bcValidatorDetails,
    (v) => v.validatorindex,
  );

  for (const exit of exits) {
    const bcValidatorDetails = keyedBCValidatorDetails[exit.validatorIndex];

    if (!bcValidatorDetails) {
      logger.error(`No data found for validator index ${exit.validatorIndex}`);

      continue;
    }

    await checkExitProcessedAndUpdate(exit, bcValidatorDetails);
  }

  return {
    success: true,
    data: null,
  };
};

const checkExitProcessedAndUpdate = async (
  dbExit: Exit,
  bcValidatorDetails: BCValidatorDetails,
): Promise<boolean> => {
  if (bcValidatorDetails.status === "exited") {
    logger.info(
      `Exit for validator index ${dbExit.validatorIndex} has been processed`,
    );

    await ExitModel.updateOne(
      { validatorIndex: dbExit.validatorIndex },
      { $set: { status: INACTIVE_STATUS } },
    );

    await sendEmailNotification({
      emailName: "PECTRA_STAKING_MANAGER_WITHDRAWAL_COMPLETE",
      metadata: {
        amount: dbExit.amount,
        emailAddress: dbExit.email,
        withdrawalAddress: dbExit.withdrawalAddress,
      },
    });

    return true;
  }

  return false;
};
