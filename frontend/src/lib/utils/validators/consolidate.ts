import { sumBy } from "lodash";
import { type SubmittingConsolidationValidatorDetails } from "pec/constants/columnHeaders";
import { type ValidatorDetails } from "pec/types/validator";

export const needsUpgradeTx = (v: ValidatorDetails): boolean => {
  return !v.withdrawalAddress.startsWith("0x02") && !v.pendingUpgrade;
};

export const getRequiredConsolidationTransactions = (
  targetValidator: ValidatorDetails,
  sourceValidators: ValidatorDetails[],
): {
  transactions: SubmittingConsolidationValidatorDetails[];
  upgradeTransactions: number;
  consolidationTransactions: number;
} => {
  const transactions: SubmittingConsolidationValidatorDetails[] = [];
  let upgradeTransactions = 0;
  let consolidationTransactions = sourceValidators.length;

  if (needsUpgradeTx(targetValidator)) {
    transactions.push({
      ...targetValidator,
      consolidationType: "upgrade",
      transactionStatus: { status: "pending" },
    });

    upgradeTransactions++;
  }

  for (const sourceValidator of sourceValidators) {
    // This transaction is an upgrade for the target and its included above so skip
    if (sourceValidator.validatorIndex === targetValidator.validatorIndex) {
      consolidationTransactions--;

      continue;
    }

    transactions.push({
      ...sourceValidator,
      consolidationType: "consolidate",
      transactionStatus: { status: "pending" },
    });
  }

  return {
    transactions,
    upgradeTransactions,
    consolidationTransactions,
  };
};

export const getNewDestinationBalance = (
  targetValidator: ValidatorDetails,
  sourceValidators: ValidatorDetails[],
) => {
  const sourceValidatorsSum = sumBy(sourceValidators, (v) => {
    // Don't include the upgrade validator in the sum
    if (v.publicKey === targetValidator.publicKey) {
      return 0;
    }

    return v.balance;
  });

  return targetValidator.balance + sourceValidatorsSum;
};
