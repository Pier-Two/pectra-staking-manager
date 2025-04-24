import { orderBy } from "lodash";
import { ValidatorDetails } from "pec/types/validator";
import { ESortDirection, SortConfig } from "pec/types/validatorTable";
import { useMemo, useState } from "react";

export interface UseValidatorSorting {
  validators: ValidatorDetails[];
}

export const useValidatorSorting = ({ validators }: UseValidatorSorting) => {
  const [sortConfig, setSortConfig] =
    useState<SortConfig<ValidatorDetails> | null>(null);

  const sortedValidators = useMemo(() => {
    if (!sortConfig) return validators;

    return orderBy(
      validators,
      (validator) => {
        const value = validator[sortConfig.key];

        if (
          sortConfig.key === "activeSince" ||
          sortConfig.key === "activeDuration"
        ) {
          return new Date(value as string).getTime();
        }

        return value;
      },
      [sortConfig.direction],
    );
  }, [validators, sortConfig]);

  const handleSort = (key: keyof ValidatorDetails) => {
    if (sortConfig && sortConfig.key === key) {
      setSortConfig({
        ...sortConfig,
        direction:
          sortConfig.direction === ESortDirection.ASC
            ? ESortDirection.DESC
            : ESortDirection.ASC,
      });
    } else {
      setSortConfig({
        key,
        direction: ESortDirection.DESC,
      });
    }
  };

  return {
    sortedValidators,
    sortConfig,
    setSortConfig: handleSort,
  };
};
