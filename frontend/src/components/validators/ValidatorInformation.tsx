import { validatorIsActive } from "pec/lib/utils/validators/status";
import type { IGenericValidators } from "pec/types/validator";
import type { FC } from "react";
import { HiBolt } from "react-icons/hi2";

export const ValidatorInformation: FC<IGenericValidators> = (props) => {
  const { validators } = props;

  const numberOfOldValidators = validators.filter(
    (validator) =>
      validator.withdrawalAddress.startsWith("0x01") &&
      validatorIsActive(validator),
  ).length;

  return (
    <div className="flex w-full flex-col gap-y-2 rounded-2xl border border-indigo-200 bg-[#A5B4FC12] p-4 text-left dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-x-4">
        <HiBolt className="min-h-4 min-w-4 text-primary" />

        {/* TODO: set font to inter once fonts pr is in */}
        {numberOfOldValidators > 0 && (
          <div className="flex flex-col gap-y-2">
            <p className="text-sm font-semibold text-primary dark:text-indigo-500">
              {numberOfOldValidators} of your validators are using the old
              credentials (0x01). Before consolidation can occur, you must
              update them to Pectra (0x02) to enable enhanced staking features.
            </p>
          </div>
        )}

        {/* TODO: set font to inter once fonts pr is in */}
        {numberOfOldValidators === 0 && (
          <div className="font-inter text-sm font-semibold text-primary dark:text-indigo-500">
            All of your validators are using the new credentials (0x02)!
          </div>
        )}
      </div>

      {numberOfOldValidators > 0 && (
        <div className="pl-8 text-xs text-black dark:text-white">
          Click start consolidation below to get started.
        </div>
      )}
    </div>
  );
};
