import { useMemo, useState } from "react";
import { orderBy } from "lodash";

import { ValidatorDetails } from "pec/types/validator";
import { ESortDirection, SortConfig } from "pec/types/validatorTable";

export interface UseValidatorSorting<Data> {
  validators: Data[];
}

const START_DIRECTION = ESortDirection.DESC;
const END_DIRECTION = ESortDirection.ASC;

export const useValidatorSorting = <Data = ValidatorDetails>({
  validators,
}: UseValidatorSorting<Data>) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<Data> | null>(null);

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

  const handleSort = (key: keyof Data) => {
    if (sortConfig && sortConfig.key === key) {
      if (sortConfig.direction === END_DIRECTION) {
        setSortConfig(null);
        return;
      }

      setSortConfig({
        ...sortConfig,
        direction: END_DIRECTION,
      });
    } else {
      setSortConfig({
        key,
        direction: START_DIRECTION,
      });
    }
  };

  return {
    sortedValidators,
    sortConfig,
    setSortConfig: handleSort,
  };
};
