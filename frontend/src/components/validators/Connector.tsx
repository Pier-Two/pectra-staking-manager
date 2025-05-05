import { cn } from "pec/lib/utils";
import type { ValidatorDetails } from "pec/types/validator";
import type { FC } from "react";
import { ConnectedAddress } from "./ConnectedAddress";
import { DetectedValidators } from "./DetectedValidators";
import { ValidatorHelp } from "./ValidatorHelp";
import { ValidatorInformation } from "./ValidatorInformation";
import { EnterAnimation } from "pec/app/(login-layout)/welcome/_components/enter-animation";

export interface IConnector {
  title?: JSX.Element | string;
  description?: JSX.Element | string;
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
      <div className="flex flex-col gap-3">
        {title && (
          <div
            className={cn("text-2xl font-570 leading-relaxed", titleClassName)}
          >
            {title}
          </div>
        )}

        {!!description &&
          (typeof description === "string" ? (
            <p className="w-full text-base">{description}</p>
          ) : (
            description
          ))}
        <div className={cn("text-left text-base", className)}>
          {validators.length > 0
            ? `You have ${validators.length} total validators using this withdrawal
          address, consolidate them to Pectra standard now to get the most out
          of Ethereum staking.`
            : `There are no validators associated to this withdrawal address.`}
        </div>
      </div>

      <ConnectedAddress
        address={connectedAddress}
        layoutId={"validators-found-connected-address"}
      />
      <DetectedValidators
        cardTitle="validators detected"
        validators={validators}
        layoutId={"validators-found-detected-validators"}
      />
      <EnterAnimation>
        <ValidatorInformation validators={validators} />
      </EnterAnimation>
      <EnterAnimation>
        <ValidatorHelp />
      </EnterAnimation>
    </>
  );
};
