import type { FC } from "react";
import type { IGenericValidators } from "pec/types/validator";
import { Zap } from "lucide-react";

export const ValidatorInformation: FC<IGenericValidators> = (props) => {
  const { validators } = props;

  const numberOfOldValidators = validators.filter((validator) =>
    validator.publicKey.startsWith("0x01"),
  ).length;

  return (
    <div className="flex min-h-[10vh] w-full items-center justify-between gap-x-4 rounded-xl border border-indigo-300 bg-indigo-50 dark:bg-gray-900 dark:border-indigo-900 p-4">
      <div className="flex items-center gap-x-4">
        <Zap className="h-5 w-5 text-indigo-500 fill-indigo-500" />
        {numberOfOldValidators > 0 && (
          <div className="flex flex-col gap-y-2">
            <div className="text-md text-indigo-700">
              {numberOfOldValidators} of your validators are using the old
              credentials (0x01). It is recommended to consolidate them to
              Pectra (0x02) to enable enhanced staking features.
            </div>

            <div className="text-sm">
              Click start consolidation below to get started.
            </div>
          </div>
        )}

        {numberOfOldValidators === 0 && (
          <div className="text-md text-blue-500">
            All of your validators are using the new credentials (0x02)!
          </div>
        )}
      </div>
    </div>
  );
};
