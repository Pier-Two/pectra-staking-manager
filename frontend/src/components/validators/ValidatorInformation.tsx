import { Zap } from "lucide-react";
import type { IGenericValidators } from "pec/types/validator";
import type { FC } from "react";

export const ValidatorInformation: FC<IGenericValidators> = (props) => {
  const { validators } = props;

  const numberOfOldValidators = validators.filter((validator) =>
    validator.withdrawalAddress.startsWith("0x01"),
  ).length;

  return (
    <div className="flex w-full flex-col gap-y-2 rounded-xl border border-indigo-200 bg-[#A5B4FC12] p-4 dark:border-indigo-900 dark:bg-gray-900">
      <div className="flex items-center gap-x-4">
        <Zap className="min-h-4 min-w-4 fill-primary text-primary" />
        {numberOfOldValidators > 0 && (
          <div className="flex flex-col gap-y-2">
            <p className="text-[14px] font-semibold leading-[14px] text-primary dark:text-indigo-500">
              {numberOfOldValidators} of your validators are using the old
              credentials (0x01). Before consolidation can occur, you must
              update them to Pectra (0x02) to enable enhanced staking features.
            </p>
          </div>
        )}

        {numberOfOldValidators === 0 && (
          <div className="text-md text-blue-500">
            All of your validators are using the new credentials (0x02)!
          </div>
        )}
      </div>
      {numberOfOldValidators > 0 && (
        <p className="ml-8 text-[13px] font-380 leading-[13px]">
          Click start consolidation below to get started.
        </p>
      )}
    </div>
  );
};
