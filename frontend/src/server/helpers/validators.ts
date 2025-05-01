import { type BCValidatorsData } from "pec/lib/api/schemas/beaconchain/validator";
import {
  ConsolidationModel,
  DepositModel,
  WithdrawalModel,
} from "pec/server/database/models";
import { getValidatorActiveInfo } from "pec/lib/utils/validators/activity";
import { getValidatorStatus } from "pec/lib/utils/validators/status";
import { ACTIVE_STATUS } from "pec/types/app";
import { TransactionStatus, type ValidatorDetails } from "pec/types/validator";

export const prePopulateBeaconchainValidatorResponse = (
  rawValidatorDetails: BCValidatorsData,
): ValidatorDetails => {
  const { activeSince, activeDuration } = getValidatorActiveInfo(
    rawValidatorDetails.activationepoch,
  );

  return {
    validatorIndex: rawValidatorDetails.validatorindex,
    publicKey: rawValidatorDetails.pubkey,
    withdrawalAddress: rawValidatorDetails.withdrawalcredentials,
    balance: rawValidatorDetails.balance / 10 ** 9,
    effectiveBalance: rawValidatorDetails.effectivebalance / 10 ** 9,
    status: getValidatorStatus(rawValidatorDetails.status),
    numberOfWithdrawals: rawValidatorDetails.total_withdrawals,
    activeSince,
    activeDuration,
    pendingRequests: [],
    pendingUpgrade: false,
  };
};

export const populateBeaconchainValidatorResponse = async (
  rawValidatorDetails: BCValidatorsData,
): Promise<ValidatorDetails> => {
  const validatorDetails =
    prePopulateBeaconchainValidatorResponse(rawValidatorDetails);

  const [withdrawTx, upgradeTx, consolidationTx, depositTx] = await Promise.all(
    [
      await WithdrawalModel.find({
        validatorIndex: validatorDetails.validatorIndex,
        status: ACTIVE_STATUS,
      }),
      await ConsolidationModel.findOne({
        targetValidatorIndex: validatorDetails.validatorIndex,
        sourceValidatorIndex: validatorDetails.validatorIndex,
        status: ACTIVE_STATUS,
      }),
      // TODO make this exclusive OR?
      await ConsolidationModel.findOne({
        status: ACTIVE_STATUS,
        // TODO: Should match target and NOT match source explicitly so you if consolidate into this
        $or: [
          { targetValidatorIndex: Number(validatorDetails.validatorIndex) },
          {
            sourceValidatorIndex: Number(validatorDetails.validatorIndex),
          },
        ],
      }),
      await DepositModel.findOne({
        validatorIndex: validatorDetails.validatorIndex,
        status: ACTIVE_STATUS,
      }),
    ],
  );

  return validatorDetails;
};
