import type { FC } from "react";
import { ConnectedAddress } from "./ConnectedAddress";
import { DetectedValidators } from "./DetectedValidators";
import { ValidatorHelp } from "./ValidatorHelp";
import { ValidatorInformation } from "./ValidatorInformation";
import { ValidatorDetails } from "pec/types/validator";
import { cn } from "pec/lib/utils";

export interface IConnector {
  title?: string;
  description?: string;
  connectedAddress: string;
  validators: ValidatorDetails[];
  className?: string;
}

export const Connector: FC<IConnector> = ({
  title,
  description,
  connectedAddress,
  validators,
  className,
}) => {
  return (
    <div className={cn("flex w-full flex-col gap-y-4", className)}>
      <div className="flex flex-col gap-y-4">
        <div className="text-center text-[26px] font-570 leading-[26px]">
          {!!title && title}
        </div>

        {!!description && <p className="w-full text-sm">{description}</p>}
        <div className="text-sm">
          You have {validators.length} total validators using this withdrawal
          address, consolidate them to Pectra standard now to get the most out
          of Ethereum staking.
        </div>
      </div>

      <ConnectedAddress address={connectedAddress} />
      <DetectedValidators
        cardTitle="validators detected"
        validators={validators}
      />
      <ValidatorInformation validators={validators} />
      <ValidatorHelp />
    </div>
  );
};
