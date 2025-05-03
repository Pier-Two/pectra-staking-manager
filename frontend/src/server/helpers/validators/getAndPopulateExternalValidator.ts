import { SupportedNetworkIds } from "pec/constants/chain";
import { IResponse } from "pec/types/response";
import { ValidatorDetails, ValidatorStatus } from "pec/types/validator";
import { getValidators } from "../requests/beaconchain/getValidators";
import { prePopulateBeaconchainValidatorResponse } from "../validators";
import { ConsolidationModel, ExitModel } from "pec/server/database/models";

export const getAndPopulateExternalValidator = async (
  searchTerm: string,
  networkId: SupportedNetworkIds,
): Promise<IResponse<ValidatorDetails>> => {
  const bcValidatorDetails = await getValidators([searchTerm], networkId);

  if (!bcValidatorDetails.success) return bcValidatorDetails;

  const validatorDetails = prePopulateBeaconchainValidatorResponse(
    bcValidatorDetails.data[0]!,
    networkId,
  );

  // We can early exit here, the remaining checks are to ensure this validator isn't about to be exited
  if (validatorDetails.status === ValidatorStatus.EXITED)
    return { success: true, data: validatorDetails };

  const [exit, sourceOfConsolidation] = await Promise.all([
    ExitModel.findOne({
      validatorIndex: validatorDetails.validatorIndex,
      networkId,
    }),
    ConsolidationModel.findOne({
      sourceValidatorIndex: validatorDetails.validatorIndex,
      networkId,
    }),
  ]);

  if (exit || sourceOfConsolidation) {
    validatorDetails.status = ValidatorStatus.EXITED;
  }

  return {
    success: true,
    data: validatorDetails,
  };
};
