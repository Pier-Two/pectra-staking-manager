<<<<<<< HEAD
import { type BCValidatorDetails } from "pec/lib/api/schemas/beaconchain/validator";
import { getValidatorActiveInfo } from "pec/lib/utils/validators/activity";
import { getValidatorStatus } from "pec/lib/utils/validators/status";
import { type ValidatorDetails } from "pec/types/validator";

export const prePopulateBeaconchainValidatorResponse = (
  rawValidatorDetails: BCValidatorDetails,
=======
import { type SupportedNetworkIds } from "pec/constants/chain";
import { type BCValidatorsData } from "pec/lib/api/schemas/beaconchain/validator";
import { getValidatorActiveInfo } from "pec/lib/utils/validators/activity";
import { getValidatorStatus } from "pec/lib/utils/validators/status";
import {
  ConsolidationModel,
  DepositModel,
  WithdrawalModel,
} from "pec/server/database/models";
import { ACTIVE_STATUS } from "pec/types/app";
import { type ValidatorDetails } from "pec/types/validator";

export const prePopulateBeaconchainValidatorResponse = (
  rawValidatorDetails: BCValidatorsData,
  network: SupportedNetworkIds,
>>>>>>> dev
): ValidatorDetails => {
  const { activeSince, activeDuration } = getValidatorActiveInfo(
    rawValidatorDetails.activationepoch,
    network,
  );

  return {
    validatorIndex: rawValidatorDetails.validatorindex,
    publicKey: rawValidatorDetails.pubkey,
    withdrawalAddress: rawValidatorDetails.withdrawalcredentials,
    balance: rawValidatorDetails.balance / 10 ** 9,
    pendingBalance: rawValidatorDetails.balance / 10 ** 9,
    effectiveBalance: rawValidatorDetails.effectivebalance / 10 ** 9,
    status: getValidatorStatus(rawValidatorDetails.status),
    numberOfWithdrawals: rawValidatorDetails.total_withdrawals,
    activeSince,
    activeDuration,
    pendingRequests: [],
    pendingUpgrade: false,
  };
};
