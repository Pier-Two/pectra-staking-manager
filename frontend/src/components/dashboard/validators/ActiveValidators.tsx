import Image from "next/image";
import type { IActiveValidators } from "pec/types/dashboard";
import type { FC } from "react";
import { MyValidatorsCard } from "./MyValidatorsCard";

export const ActiveValidators: FC<IActiveValidators> = (props) => {
  const { activeValidators, inactiveValidators } = props;

  return (
    <MyValidatorsCard
      title="Active Validators"
      body={
        <div className="flex flex-row items-center gap-x-2">
          <Image
            src="/icons/EthValidator.svg"
            alt="Wallet"
            width={24}
            height={24}
          />
          <div>{activeValidators}</div>
        </div>
      }
      subtext={inactiveValidators ? `+${inactiveValidators} inactive` : ""}
    />
  );
};
