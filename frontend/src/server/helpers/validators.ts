import { BCValidatorsResponse } from "pec/lib/api/schemas/beaconchain/validator";
import {
  ConsolidationModel,
  DepositModel,
  WithdrawalModel,
} from "pec/lib/database/models";
import { getValidatorActiveInfo } from "pec/lib/utils/validators/activity";
import { getValidatorStatus } from "pec/lib/utils/validators/status";
import { ACTIVE_STATUS } from "pec/types/app";
import { TransactionStatus, ValidatorDetails } from "pec/types/validator";

export const populateBeaconchainValidatorResponse = async (
  rawValidatorDetails: BCValidatorsResponse["data"][0],
): Promise<ValidatorDetails> => {
  const { activeSince, activeDuration } = getValidatorActiveInfo(
    rawValidatorDetails.activationepoch,
  );

  const validatorDetails: ValidatorDetails = {
    validatorIndex: rawValidatorDetails.validatorindex,
    publicKey: rawValidatorDetails.pubkey,
    withdrawalAddress: rawValidatorDetails.withdrawalcredentials,
    balance: rawValidatorDetails.balance / 10 ** 9,
    effectiveBalance: rawValidatorDetails.effectivebalance / 10 ** 9,
    status: getValidatorStatus(rawValidatorDetails.status),
    numberOfWithdrawals: rawValidatorDetails.total_withdrawals,
    activeSince,
    activeDuration,
    consolidationTransaction: undefined,
    depositTransaction: undefined,
    upgradeSubmitted: false,
    hasPendingDeposit: false,
  };

  const [withdrawTx, upgradeTx, consolidationTx, depositTx] = await Promise.all(
    [
      await WithdrawalModel.find({
        validatorIndex: validatorDetails.validatorIndex,
        status: ACTIVE_STATUS,
      }),
      await ConsolidationModel.findOne({
        targetValidatorIndex: validatorDetails.validatorIndex,
        sourceTargetValidatorIndex: validatorDetails.validatorIndex,
        status: ACTIVE_STATUS,
      }),
      // TODO make this exclusive OR?
      await ConsolidationModel.findOne({
        status: ACTIVE_STATUS,
        // TODO: Should match target and NOT match source explicitly so you if consolidate into this
        $or: [
          { targetValidatorIndex: Number(validatorDetails.validatorIndex) },
          {
            sourceTargetValidatorIndex: Number(validatorDetails.validatorIndex),
          },
        ],
      }),
      await DepositModel.findOne({
        validatorIndex: validatorDetails.validatorIndex,
        status: ACTIVE_STATUS,
      }),
    ],
  );

  // if (withdrawTx) validatorDetails.withdrawalTransactions = withdrawTx;

  if (upgradeTx) validatorDetails.upgradeSubmitted = true;

  // TODO: Doesn't capture that there might be 2 consolidations for an address; 1 to upgrade, 2 to consolidate
  if (consolidationTx) {
    validatorDetails.consolidationTransaction = {
      hash: consolidationTx.txHash,
      status: TransactionStatus.SUBMITTED,
      isConsolidatedValidator:
        rawValidatorDetails.validatorindex ===
        consolidationTx?.targetValidatorIndex,
    };
  }

  if (depositTx) {
    validatorDetails.depositTransaction = {
      hash: depositTx.txHash,
      status: TransactionStatus.SUBMITTED,
    };
    validatorDetails.hasPendingDeposit = true;
  }

  return validatorDetails;
};
