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
    if (sourceValidator.validatorIndex === targetValidator.validatorIndex)
      continue;

    if (needsUpgradeTx(sourceValidator)) {
      transactions.push({
        ...sourceValidator,
        consolidationType: "upgrade",
        transactionStatus: { status: "pending" },
      });

      upgradeTransactions++;
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
    consolidationTransactions: sourceValidators.length,
  };
};
