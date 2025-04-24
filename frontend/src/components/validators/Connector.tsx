import clsx from "clsx";
import type { IConnector } from "pec/types/validator";
import type { FC } from "react";
import { ConnectedAddress } from "./ConnectedAddress";
import { DetectedValidators } from "./DetectedValidators";
import { ValidatorHelp } from "./ValidatorHelp";
import { ValidatorInformation } from "./ValidatorInformation";

export const Connector: FC<IConnector> = ({
  title,
  description,
  connectedAddress,
  validators,
  textAlignment,
}) => {
  return (
    <div className="flex w-full flex-col gap-y-9">
      <div className="flex flex-col gap-y-4">
        <div className="font-570 text-center text-[26px] leading-[26px]">
          {!!title && title}
        </div>

        {!!description && (
          <p className="w-full text-gray-700 text-center">{description}</p>
        )}

        <p
          className={clsx(
            "w-full px-[2%] text-[15px] font-380 leading-[15px] text-zinc-950 dark:text-zinc-50",
            textAlignment === "center" ? "text-center" : "text-left",
          )}
        >
          You have {validators.length} total validators using this withdrawal
          address, consolidate them to Pectra standard now to get the most out
          of Ethereum staking.
        </p>
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
