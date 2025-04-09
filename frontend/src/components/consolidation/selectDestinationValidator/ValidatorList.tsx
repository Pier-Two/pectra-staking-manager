"use client";

import { ValidatorCard } from "pec/components/validators/cards/ValidatorCard";
import { useConsolidationStore } from "pec/hooks/use-consolidation-store";
import { useWalletAddress } from "pec/hooks/useWallet";
import { api } from "pec/trpc/react";
import type { ValidatorDetails } from "pec/types/validator";

export const ValidatorList = () => {
  const { setConsolidationTarget, setProgress } = useConsolidationStore();
  const walletAddress = useWalletAddress();

  const { data: validators, isLoading } = api.validators.getValidators.useQuery(
    {
      address: walletAddress || "",
    },
    { enabled: !!walletAddress },
  );

  const handleValidatorClick = (validator: ValidatorDetails) => {
    setConsolidationTarget(validator);
    setProgress(2);
  };

  const LoadingSkeletons = () => (
    <>
      {[1, 2, 3].map((index) => (
        <div
          key={`loading-${index}`}
          className="mb-2 h-24 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
        />
      ))}
    </>
  );

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

      {validators && validators.length > 0 ? (
        validators.map((validator, index) => (
          <ValidatorCard
            key={`validator-${validator.validatorIndex}-${index}`}
            hasBackground={true}
            hasHover={true}
            onClick={() => handleValidatorClick(validator)}
            shrink={false}
            validator={validator}
          />
        ))
      ) : (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          No validators found
        </div>
      )}
    </div>
  );
};
