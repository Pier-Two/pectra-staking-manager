import { FC } from "react";
import { IConnector } from "pec/types/validator";
import { ConnectedAddress } from "./connectedAddress";
import { DetectedValidators } from "./detectedValidators";
import { ValidatorInformation } from "./validatorInformation";

export const Connector: FC<IConnector> = (props) => {
  const { connectedAddress, validators } = props;

  return (
    <div className="flex flex-col gap-4">
      <ConnectedAddress address={connectedAddress} />
      <DetectedValidators validators={validators} />
      <ValidatorInformation validators={validators} />
    </div>
  );
};
