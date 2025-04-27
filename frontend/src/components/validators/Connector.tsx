import type { FC } from "react";
import { ConnectedAddress } from "./ConnectedAddress";
import { DetectedValidators } from "./DetectedValidators";
import { ValidatorHelp } from "./ValidatorHelp";
import { ValidatorInformation } from "./ValidatorInformation";
import { ValidatorDetails } from "pec/types/validator";
import { cn } from "pec/lib/utils";

export interface IConnector {
  title?: JSX.Element | string;
  description?: string;
  connectedAddress: string;
  validators: ValidatorDetails[];
  className?: string;
  titleClassName?: string;
}

export const Connector: FC<IConnector> = ({
  title,
  description,
  connectedAddress,
  validators,
  className,
  titleClassName,
}) => {
  return (
    <>
      {title && (
        <div
          className={cn("text-2xl font-570 leading-relaxed", titleClassName)}
        >
          {title}
        </div>
      )}

      {!!description && <p className="w-full text-sm">{description}</p>}
      <div className={cn("text-left text-sm", className)}>
        You have {validators.length} total validators using this withdrawal
        address, consolidate them to Pectra standard now to get the most out of
        Ethereum staking.
      </div>

      <ConnectedAddress address={connectedAddress} />
      <DetectedValidators
        cardTitle="validators detected"
        validators={validators}
      />
      <ValidatorInformation validators={validators} />
      <ValidatorHelp />
    </>
  );
};
