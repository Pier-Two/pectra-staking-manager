import type { FC } from "react";
import type { IConnector } from "pec/types/validator";
import { ConnectedAddress } from "./ConnectedAddress";
import { ValidatorInformation } from "./ValidatorInformation";
import { ValidatorHelp } from "./ValidatorHelp";
import { DetectedValidators } from "./DetectedValidators";

export const Connector: FC<IConnector> = (props) => {
  const { connectedAddress, validators, textAlignment } = props;
  return (
    <div className="flex w-full flex-col gap-8">
      <div className={`text-sm text-gray-700 dark:text-gray-400 ${textAlignment === "center" ? "text-center" : "text-left"}`}>
        You have {validators.length} total validators using this withdrawal
        address, consolidate them to Pectra standard now to get the most out of
        Ethereum staking.
      </div>

      <ConnectedAddress address={connectedAddress} />
      <DetectedValidators cardTitle="validators detected" validators={validators} />
      <ValidatorInformation validators={validators} />
      <ValidatorHelp />
    </div>
  );
};
