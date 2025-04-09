import { ValidatorList } from "./ValidatorList";

export const SelectDestinationValidator = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="text-2xl font-medium">Destination Validator</div>
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Your destination validator will receive all staked ETH from source
          validators and be updated to the new Pectra standard (0x02).
        </div>

        <div className="text-sm text-gray-700 dark:text-gray-300">
          To consolidate a single validator, select it as both the destination
          and the source validator.
        </div>
      </div>

      <div className="text-md font-medium">Select destination validator</div>

      <ValidatorList />
    </div>
  );
};
