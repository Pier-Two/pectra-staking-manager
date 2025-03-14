import type { FC } from "react";
import type { IConnector } from "pec/types/validator";
import { ConnectedAddress } from "./connectedAddress";
import { DetectedValidators } from "./detectedValidators";
import { ValidatorInformation } from "./validatorInformation";
import { ValidatorHelp } from "./validatorHelp";

export const Connector: FC<IConnector> = (props) => {
  const { connectedAddress, validators } = props;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="w-[40vw] text-center text-gray-700 dark:text-gray-400">
        You have {validators.length} total validators using this withdrawal
        address, consolidate them to Pectra standard now to get the most out of
        Ethereum staking
      </div>

      <ConnectedAddress address={connectedAddress} />
      <DetectedValidators validators={validators} />
      <ValidatorInformation validators={validators} />
      <ValidatorHelp />
    </div>
  );
};
