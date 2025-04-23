"use client";

import { ValidatorCard } from "pec/components/validators/cards/ValidatorCard";
import { useConsolidationStore } from "pec/hooks/use-consolidation-store";
import { ValidatorStatus, type ValidatorDetails } from "pec/types/validator";
import LoadingSkeletons from "./LoadingSkeletons";
import { useValidators } from "pec/hooks/useValidators";

export const ValidatorList = () => {
  const { setConsolidationTarget, setProgress } = useConsolidationStore();

  const { data: validators, isLoading } = useValidators();

  const activeValidators = validators?.filter(
    (validator) =>
      validator?.status === ValidatorStatus.ACTIVE &&
      validator?.consolidationTransaction?.isConsolidatedValidator !== false,
  );

  const inactiveValidators = validators?.filter(
    (validator) =>
      validator?.status === ValidatorStatus.INACTIVE ||
      validator?.consolidationTransaction?.isConsolidatedValidator === false,
  );

  const exitedValidators = validators?.filter(
    (validator) => validator?.status === ValidatorStatus.EXITED,
  );

  const depositPendingValidators = validators?.filter(
    (validator) => validator?.hasPendingDeposit,
  );

  const handleValidatorClick = (validator: ValidatorDetails) => {
    setConsolidationTarget(validator);
    setProgress(2);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex-col-3 flex w-full justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Validator
          </div>
        </div>

        <div className="text-sm text-gray-700 dark:text-gray-300">
          Credential
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Balance
          </div>
        </div>
      </div>

      {isLoading && <LoadingSkeletons />}

      {activeValidators && activeValidators.length > 0 ? (
        activeValidators.map((validator, index) => (
          <ValidatorCard
            key={`validator-${validator.validatorIndex}-${index}`}
            hasHover={true}
            onClick={() => handleValidatorClick(validator)}
            shrink={false}
            validator={validator}
          />
        ))
      ) : (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          No active validators found
        </div>
      )}

      {inactiveValidators && inactiveValidators.length > 0 && (
        <div className="mt-2 flex w-full flex-col gap-2">
          <div className="text-md font-medium">
            Previously Consolidated Validators
          </div>

          {inactiveValidators.map((validator, index) => (
            <ValidatorCard
              key={`validator-${validator.validatorIndex}-${index}`}
              hasHover={false}
              onClick={() => handleValidatorClick(validator)}
              shrink={false}
              validator={validator}
            />
          ))}
        </div>
      )}

      {exitedValidators && exitedValidators.length > 0 && (
        <div className="mt-2 flex w-full flex-col gap-2">
          <div className="text-md font-medium">Exited Validators</div>

          {exitedValidators.map((validator, index) => (
            <ValidatorCard
              key={`validator-${validator.validatorIndex}-${index}`}
              hasHover={false}
              shrink={false}
              validator={validator}
            />
          ))}
        </div>
      )}

      {depositPendingValidators && depositPendingValidators.length > 0 && (
        <div className="mt-2 flex w-full flex-col gap-2">
          <div className="text-md font-medium">
            Validators with Pending Deposits
          </div>

          {depositPendingValidators.map((validator, index) => (
            <ValidatorCard
              key={`validator-${validator.validatorIndex}-${index}`}
              hasHover={false}
              shrink={false}
              validator={validator}
            />
          ))}
        </div>
      )}
    </div>
  );
};
